import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PokemonListPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
      </Routes>
    </>
  );
};

export default App;
