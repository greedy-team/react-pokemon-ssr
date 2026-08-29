import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import type { InitialData } from "./pages/PokemonListPage";

export function render(initialData: InitialData, url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialData={initialData} />
      </StaticRouter>
    </StrictMode>,
  );
}
