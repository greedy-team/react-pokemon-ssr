import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchRoutes } from "react-router-dom";
import App from "./App";
import { routes, NOT_FOUND_PATH } from "./routes";

function resolveStatus(url: string) {
  const pathname = url.split("?")[0];
  const matches = matchRoutes(routes, pathname);
  const isNotFound =
    !matches || matches.some((match) => match.route.path === NOT_FOUND_PATH);

  return isNotFound ? 404 : 200;
}

export function render(url: string) {
  // 서버에는 window가 없어 현재 URL을 스스로 알 수 없기 대문에 요청 URL을 주입받음
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  return { html, status: resolveStatus(url) };
}
