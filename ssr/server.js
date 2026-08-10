import fs from "node:fs/promises";
import { Transform } from "node:stream";
import express from "express";

const PORT = Number(process.env.PORT) || 3000;
const ABORT_DELAY = 10000;
// 개발에서는 Vite가 소스를 즉석 변환하고, 프로덕션에서는 미리 빌드된 결과만 읽는다.
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();

  let vite;
  let prodTemplate;
  let prodEntry;

  if (isProduction) {
    // 빌드된 정적 파일(JS·CSS)은 Express가 직접 서빙한다.
    app.use(express.static("./dist/client", { index: false }));

    // 템플릿과 서버 엔트리는 요청마다 읽을 필요가 없어 한 번만 불러둔다.
    prodTemplate = await fs.readFile("./dist/client/index.html", "utf-8");
    prodEntry = await import("./dist/server/entry-server.js");
  } else {
    // middlewareMode: Vite를 독립 서버가 아닌 Express 미들웨어로 붙여 개발 중 HMR을 유지한다.
    // appType "custom": Vite가 index.html을 직접 서빙하지 않게 해서 HTML 응답 책임을 아래 핸들러가 갖는다.
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  app.use(async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 프로덕션 템플릿에는 이미 해시가 붙은 에셋 경로가 들어 있다.
      const template = isProduction
        ? prodTemplate
        : await vite.transformIndexHtml(
            url,
            await fs.readFile("./index.html", "utf-8"),
          );

      const { render, resolveStatus, loadInitialData, serializeInitialData } =
        isProduction
          ? prodEntry
          : await vite.ssrLoadModule("/src/entry-server.tsx");

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
          if (!isProduction) vite.ssrFixStacktrace(error);
          console.error(error);
        },
      });

      setTimeout(abort, ABORT_DELAY);
    } catch (error) {
      if (!isProduction) vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  app.listen(PORT, () => {
    console.log(
      `[${isProduction ? "production" : "development"}] Server running at http://localhost:${PORT}`,
    );
  });
}

startServer();
