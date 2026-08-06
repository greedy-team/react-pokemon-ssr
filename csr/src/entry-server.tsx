import { renderToString } from "react-dom/server";
import { matchPath, StaticRouter } from "react-router";
import App from "./App";
import { fetchPokemonDetail, fetchPokemonList } from "./api/pokemon";

export async function render(url: string) {
  const { pathname, searchParams } = new URL(url, "http://localhost");

  let initialData;

  if (pathname === "/") {
    const page = Number(searchParams.get("page") || "1");
    initialData = await fetchPokemonList(page);
  }

  // "/pokemon/:id" 경로 (상세 페이지)
  const detailMatch = matchPath("/pokemon/:id", pathname);
  if (detailMatch) {
    const id = Number(detailMatch.params.id);
    initialData = await fetchPokemonDetail(id);
  }
  const html = renderToString(
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>,
  );
  return { html, initialData };
}
