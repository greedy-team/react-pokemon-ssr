import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PassThrough } from "node:stream";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

async function createServer() {
  const app = express();
  let loadTemplate;
  let loadModules;
  let fixStacktrace;

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    loadTemplate = async (url) => {
      const raw = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8",
      );
      return await vite.transformIndexHtml(url, raw);
    };
    loadModules = async () => vite.ssrLoadModule("/src/entry-server.tsx");
    fixStacktrace = (e) => vite.ssrFixStacktrace(e);
  } else {
    app.use(
      express.static(path.resolve(__dirname, "dist/client"), {
        index: false,
      }),
    );

    const prodTemplate = fs.readFileSync(
      path.resolve(__dirname, "dist/client/index.html"),
      "utf-8",
    );
    const prodServerModule = await import("./dist/server/entry-server.js");

    loadTemplate = async () => prodTemplate;
    loadModules = async () => prodServerModule;
    fixStacktrace = () => {};
  }

  app.use(async (req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) {
      return next();
    }
    const url = req.originalUrl;

    try {
      const template = await loadTemplate(url);
      const { render, fetchPokemonDetail, fetchPokemonList } =
        await loadModules();

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
      fixStacktrace(e);
      console.error("서버 렌더링 중 에러 발생:", e);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

createServer();
