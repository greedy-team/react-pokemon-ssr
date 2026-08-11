import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage, { type InitialData } from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

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
          element={
            initialData?.notFound ? (
              <NotFoundPage />
            ) : (
              <PokemonDetailPage initialData={initialData?.pokemon} />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
