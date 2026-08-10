import type { RouteObject } from "react-router-dom";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export const NOT_FOUND_PATH = "*";

export const routes: RouteObject[] = [
  { path: "/", element: <PokemonListPage /> },
  { path: "/pokemon/:id", element: <PokemonDetailPage /> },
  { path: NOT_FOUND_PATH, element: <NotFoundPage /> },
];
