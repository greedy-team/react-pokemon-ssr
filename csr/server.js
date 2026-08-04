import fs from "node:fs/promises";
import express from "express";
import { createServer as createViteServer } from "vite";

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(async (req, res) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile("index.html", "utf-8");

      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      const { html: appHtml } = await render(url);

      const finalHtml = template.replace("<!--app-html-->", () => appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(5173, () => {
    console.log("서버 실행중: http://localhost:5173");
  });
}

createServer();
