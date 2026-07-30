import { renderToString } from "react-dom/server";
import App from "../../ssr/src/App";

export function render() {
  const html = renderToString(<App />);
  return { html };
}
