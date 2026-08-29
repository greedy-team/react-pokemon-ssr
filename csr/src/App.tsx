import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import type { PokemonDetail, PokemonListResponse } from "./api/pokemon";

type Props = {
  initialData?: PokemonListResponse | PokemonDetail;
};

const App = ({ initialData }: Props) => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PokemonListPage
              initialData={initialData as PokemonListResponse | undefined}
            />
          }
        />
        <Route
          path="/pokemon/:id"
          element={
            <PokemonDetailPage
              initialData={initialData as PokemonDetail | undefined}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
