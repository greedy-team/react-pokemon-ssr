import fs from "node:fs";
import path from "node:path";
import express from "express";
import { createServer as createViteServer } from "vite";

async function createServer() {
  const app = express();

  // 미들웨어 모드로 Vite 서버를 생성하고 앱 타입을 'custom'으로 설정합니다.
  // 그러면 Vite 자체 HTML 제공 로직이 비활성화되어 부모 서버가
  // 제어를 맡을 수 있습니다.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  // Vite의 connect 인스턴스를 미들웨어로 사용합니다. 자체 express 라우터
  // (express.Router())를 사용한다면 router.use를 사용해야 합니다.
  // 서버가 다시 시작되어도(예: 사용자가 vite.config.js를 수정한 뒤)
  // `vite.middlewares`는 동일한 참조를 유지합니다
  // (Vite와 플러그인이 주입한 미들웨어의 새 내부 스택 포함).
  // 따라서 아래 코드는 재시작 후에도 유효합니다.
  app.use(vite.middlewares);

  app.use("*all", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. index.html을 읽습니다.
      let template = fs.readFileSync(
        path.resolve(import.meta.dirname, "index.html"),
        "utf-8",
      );

      // 2. Vite HTML 변환을 적용합니다. 이 과정에서 Vite HMR 클라이언트를 주입하고,
      //    Vite 플러그인의 HTML 변환도 적용합니다. 예를 들어 @vitejs/plugin-react의
      //    전역 프리앰블이 여기에 포함됩니다.
      template = await vite.transformIndexHtml(url, template);

      // 3. 서버 엔트리를 로드합니다. ssrLoadModule은 ESM 소스 코드를 Node.js에서
      //    사용할 수 있도록 자동 변환합니다. 번들링은 필요 없으며,
      //    HMR과 비슷한 효율적인 무효화를 제공합니다.
      const { render } = await vite.ssrLoadModule("/src/entry-server.js");
      const { fetchPokemonList, fetchPokemonDetail } = await vite.ssrLoadModule(
        "/src/api/pokemon.ts",
      );
      const { HTTP_STATUS } = await vite.ssrLoadModule("/src/constants.ts");

      // 4. 앱 HTML을 렌더링합니다. entry-server.js에서 export한 `render` 함수가
      //    적절한 프레임워크 SSR API를 호출한다고 가정합니다.
      //    예: ReactDOMServer.renderToString()
      const requestedPage = Number(req.query.page) || 1;
      const pathname = url.split("?")[0];
      const pokemonIdMatch = pathname.match(/^\/pokemon\/(\d+)$/);
      let initialData;
      let statusCode = HTTP_STATUS.OK;

      if (pokemonIdMatch) {
        const pokemonId = Number(pokemonIdMatch[1]);
        const pokemonDetail = await fetchPokemonDetail(pokemonId);
        if (pokemonDetail) {
          initialData = { pokemon: pokemonDetail };
        } else {
          initialData = { notFound: true };
          statusCode = HTTP_STATUS.NOT_FOUND;
        }
      } else if (pathname === "/") {
        const data = await fetchPokemonList(requestedPage);
        initialData = {
          pokemons: data.results,
          totalPages: data.totalPages,
          page: requestedPage,
        };
      } else {
        initialData = { notFound: true };
        statusCode = HTTP_STATUS.NOT_FOUND;
      }

      const appHtml = await render(initialData, url);

      // 5. 앱이 렌더링한 HTML을 템플릿에 주입합니다.
      const initialDataJson = JSON.stringify(initialData);
      const html = template
        .replace(`<!--pokemon-ssr-content-->`, () => appHtml)
        .replace(
          `<!--pokemon-ssr-initial-data-->`,
          () =>
            `<script>window.__INITIAL_DATA__ = ${initialDataJson};</script>`,
        );

      // 6. 렌더링된 HTML을 반환합니다.
      res.status(statusCode).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // 오류를 잡으면 Vite가 스택 트레이스를 실제 소스 코드에 매핑되도록
      // 수정하게 합니다.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  app.listen(5173);
}

createServer();
