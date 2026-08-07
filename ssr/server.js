import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) {
      return next();
    }
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8",
      );

      template = await vite.transformIndexHtml(url, template);

      const { fetchPokemonList } = await vite.ssrLoadModule(
        "/src/api/pokemon.ts",
      );
      const initialData = await fetchPokemonList(1);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      const { html: appHtml } = render(url, initialData);

      const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;

      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace("</head>", `${dataScript}</head>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

createServer();
