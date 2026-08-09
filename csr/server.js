import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { createServer as createViteServer } from "vite";

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    root: import.meta.dirname,
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile(
        path.resolve(import.meta.dirname, "index.html"),
        "utf-8",
      );

      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      const { html: appHtml } = await render(url);

      const finalHtml = template.replace("<!--app-html-->", () => appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.log("서버 실행중: http://localhost:5173");
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);

    if (process.env.NODE_ENV === "development") {
      res.status(500).end(err.stack);
    } else {
      res.status(500).end("서버 오류가 발생했습니다");
    }
  });
}

createServer();
