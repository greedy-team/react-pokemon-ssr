import fs from "node:fs/promises";
import express from "express";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

async function startServer() {
  const app = express();

  // middlewareMode: Vite를 독립된 서버가 아닌 Express를 붙여 개발 중 HMR 가능하게 함
  // appType "custom": Vite가 index.html을 직접 가져오지 않게 해서 HTML 응답 책임을 아래 핸들러가 갖도록 함
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

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html: appHtml, status } = render(url);

      // 치환값을 함수로 넘김(이때 마크업 깨질 수도 있음!!)
      const html = template.replace("<!--ssr-outlet-->", () => appHtml);

      res.status(status).set({ "Content-Type": "text/html" }).end(html);
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
