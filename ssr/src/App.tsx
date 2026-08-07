import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";

interface AppProps {
  initialData?: any;
}

const App = ({ initialData }: AppProps) => {
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
