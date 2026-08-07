import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PassThrough } from "node:stream";
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

      const parsedUrl = new URL(url, "http://localhost:3000");
      const pathname = parsedUrl.pathname;
      const searchParams = parsedUrl.searchParams;

      let initialData = null;

      const detailMatch = pathname.match(/^\/pokemon\/(\d+)$/);
      if (detailMatch) {
        const pokemonId = detailMatch[1];
        const { fetchPokemonDetail } = await vite.ssrLoadModule(
          "/src/api/pokemon.ts",
        );
        initialData = await fetchPokemonDetail(pokemonId);
      } else if (pathname === "/") {
        const page = searchParams.get("page") || "1";
        const { fetchPokemonList } = await vite.ssrLoadModule(
          "/src/api/pokemon.ts",
        );
        initialData = await fetchPokemonList(Number(page));
      }

      const [htmlStart, htmlEnd] = template.split("<!--app-html-->");

      const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;

      const headWithData = htmlStart.replace("</head>", `${dataScript}</head>`);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      let didError = false;

      const stream = render(url, initialData, {
        onShellReady() {
          res.status(didError ? 500 : 200);
          res.setHeader("Content-Type", "text/html; charset=utf-8");

          const passThrough = new PassThrough();

          passThrough.on("end", () => {
            res.end(htmlEnd);
          });

          res.write(headWithData);

          stream.pipe(passThrough);

          passThrough.pipe(res, { end: false });
        },

        onShellError(error) {
          console.error(error);
          res.status(500).send("Server Error");
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      });
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
