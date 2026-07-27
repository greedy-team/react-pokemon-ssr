import fs from "node:fs/promises";
import express from "express";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

async function startServer() {
  const app = express();

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
      const appHtml = render(url);

      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
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
