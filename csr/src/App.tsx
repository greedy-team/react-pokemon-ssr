import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import type { PokemonListItem } from "./api/pokemon";

type Props = {
  initialData?: {
    results: PokemonListItem[];
    totalPages: number;
  };
};

const App = ({ initialData }: Props) => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<PokemonListPage initialData={initialData} />}
        />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
      </Routes>
    </>
  );
};

export default App;
