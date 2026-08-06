import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { fetchPokemonList } from "./api/pokemon";

export async function render(url: string) {
  const data = await fetchPokemonList(1);

  const html = renderToString(
    <StaticRouter location={url}>
      <App initialData={data} />
    </StaticRouter>,
  );
  return { html, initialData: data };
}
