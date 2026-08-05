import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage, { type InitialData } from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";

interface Props {
  initialData?: InitialData;
}

const App = ({ initialData }: Props) => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PokemonListPage
              initialData={initialData?.pokemons ? initialData : undefined}
            />
          }
        />
        <Route
          path="/pokemon/:id"
          element={<PokemonDetailPage initialData={initialData?.pokemon} />}
        />
      </Routes>
    </>
  );
};

export default App;
