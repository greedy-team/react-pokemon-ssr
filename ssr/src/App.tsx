import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";

interface AppProps {
  initialData?: any;
}

const App = ({ initialData }: AppProps) => {
  const isListData = initialData && Array.isArray(initialData.results);
  const isDetailData =
    initialData &&
    (typeof initialData.id === "number" ||
      typeof initialData.name === "string");

  return (
    <>
      <Header />
      <Suspense fallback={<p className="loading">불러오는 중...</p>}>
        <Routes>
          <Route
            path="/"
            element={
              <PokemonListPage
                initialData={isListData ? initialData : undefined}
              />
            }
          />
          <Route
            path="/pokemon/:id"
            element={
              <PokemonDetailPage
                initialData={isDetailData ? initialData : undefined}
              />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
