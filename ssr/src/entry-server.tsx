import { StrictMode } from "react";
import {
  renderToPipeableStream,
  type RenderToPipeableStreamOptions,
} from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

export function render(
  url: string,
  initialData?: any,
  options?: RenderToPipeableStreamOptions,
) {
  return renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialData={initialData} />
      </StaticRouter>
    </StrictMode>,
    options,
  );
}
