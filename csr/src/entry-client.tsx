import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import type { PokemonListItem } from "./api/pokemon";

declare global {
  interface Window {
    __INITIAL_DATA__?: unknown;
  }
}
type InitialData = {
  results: PokemonListItem[];
  totalPages: number;
};

const initialData = window.__INITIAL_DATA__ as InitialData | undefined;

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>,
);
