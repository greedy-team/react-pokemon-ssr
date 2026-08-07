import fs from "node:fs/promises";
import { Transform } from "node:stream";
import express from "express";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const ABORT_DELAY = 10000;

async function startServer() {
  const app = express();

  // middlewareMode: Vite를 독립 서버가 아닌 Express 미들웨어로 붙여 개발 중 HMR을 유지한다.
  // appType "custom": Vite가 index.html을 직접 서빙하지 않게 해서 HTML 응답 책임을 아래 핸들러가 갖는다.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const rawTemplate = await fs.readFile("./index.html", "utf-8");
      const template = await vite.transformIndexHtml(url, rawTemplate);

      const { render, resolveStatus } = await vite.ssrLoadModule(
        "/src/entry-server.tsx",
      );
      const { loadInitialData, serializeInitialData } = await vite.ssrLoadModule(
        "/src/initialData.ts",
      );

      // 일부러 await 하지 않는다. 데이터를 기다리는 동안 쉘을 먼저 흘려보내기 위해서다.
      const dataPromise = loadInitialData(url);
      const [htmlStart, htmlEnd] = template.split("<!--ssr-outlet-->");

      let didError = false;

      const { pipe, abort } = render(url, dataPromise, {
        // 쉘(Suspense 바깥)이 준비된 시점. 여기서 pipe를 시작해야 fallback이 먼저 나간다.
        onShellReady() {
          res
            .status(didError ? 500 : resolveStatus(url))
            .set({ "Content-Type": "text/html" });
          res.write(htmlStart);

          const injectTail = new Transform({
            transform(chunk, encoding, callback) {
              res.write(chunk, encoding);
              callback();
            },
            final(callback) {
              // 스트림이 끝난 시점에는 데이터가 이미 준비되어 있다.
              dataPromise.then((data) => {
                const dataScript = `<script>window.__INITIAL_DATA__ = ${serializeInitialData(data)}</script>`;
                res.end(htmlEnd.replace("<!--ssr-data-->", () => dataScript));
                callback();
              });
            },
          });

          pipe(injectTail);
        },
        // 쉘조차 만들지 못한 경우. 이때는 스트리밍 대신 오류 응답으로 끝낸다.
        onShellError() {
          res
            .status(500)
            .set({ "Content-Type": "text/html" })
            .end("<h1>서버에서 페이지를 만들지 못했습니다.</h1>");
        },
        onError(error) {
          didError = true;
          vite.ssrFixStacktrace(error);
          console.error(error);
        },
      });

      setTimeout(abort, ABORT_DELAY);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
