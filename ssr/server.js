import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PassThrough } from "node:stream";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();
  let vite;

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.resolve(__dirname, "dist/client"), {
        index: false,
      }),
    );
  }

  app.use(async (req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) {
      return next();
    }
    const url = req.originalUrl;

    try {
      let template;
      let render;
      let fetchPokemonDetail;
      let fetchPokemonList;
      if (!isProd) {
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8",
        );

        template = await vite.transformIndexHtml(url, template);

        const serverModule = await vite.ssrLoadModule("/src/entry-server.tsx");
        render = serverModule.render;
        fetchPokemonDetail = serverModule.fetchPokemonDetail;
        fetchPokemonList = serverModule.fetchPokemonList;
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, "dist/client/index.html"),
          "utf-8",
        );

        const serverModule = await import("./dist/server/entry-server.js");
        render = serverModule.render;
        fetchPokemonDetail = serverModule.fetchPokemonDetail;
        fetchPokemonList = serverModule.fetchPokemonList;
      }

      const parsedUrl = new URL(url, "http://localhost:3000");
      const pathname = parsedUrl.pathname;
      const searchParams = parsedUrl.searchParams;

      let initialData = null;

      const detailMatch = pathname.match(/^\/pokemon\/(\d+)$/);
      if (detailMatch) {
        const pokemonId = detailMatch[1];

        initialData = await fetchPokemonDetail(pokemonId);
      } else if (pathname === "/") {
        const page = searchParams.get("page") || "1";

        initialData = await fetchPokemonList(Number(page));
      }

      const [htmlStart, htmlEnd] = template.split("<!--app-html-->");

      const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;

      const headWithData = htmlStart.replace("</head>", `${dataScript}</head>`);

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
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error("서버 렌더링 중 에러 발생:", e);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

createServer();
