import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import type { InitialData } from "./pages/PokemonListPage";
import "./styles/global.css";

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App initialData={window.__INITIAL_DATA__} />
    </BrowserRouter>
  </StrictMode>,
);
