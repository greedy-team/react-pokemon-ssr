import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { StaticRouter, matchRoutes } from "react-router-dom";
import App from "./App";
import { routes, NOT_FOUND_PATH } from "./routes";
import { InitialDataProvider } from "./context/InitialDataContext";
import type { InitialData } from "./initialData";

export function resolveStatus(url: string) {
  const pathname = url.split("?")[0];
  const matches = matchRoutes(routes, pathname);
  const isNotFound =
    !matches || matches.some((match) => match.route.path === NOT_FOUND_PATH);

  return isNotFound ? 404 : 200;
}

export function render(
  url: string,
  dataPromise: Promise<InitialData>,
  options: RenderToPipeableStreamOptions,
) {
  // 서버에는 window가 없어 현재 URL을 스스로 알 수 없다. 요청 URL을 주입받는다.
  return renderToPipeableStream(
    <StrictMode>
      <InitialDataProvider dataPromise={dataPromise}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </InitialDataProvider>
    </StrictMode>,
    options,
  );
}
