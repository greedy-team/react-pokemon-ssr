import { useEffect, useState } from "react";
import "../styles/PokemonList.css";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonList, type PokemonListItem } from "../api/pokemon";
import { useInitialData } from "../context/InitialDataContext";
import PokemonList from "../components/PokemonList";
import Pagination from "../components/Pagination";

const PokemonListPage = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const initialData = useInitialData();

  const [pokemons, setPokemons] = useState<PokemonListItem[]>(
    initialData.list?.results ?? [],
  );
  const [totalPages, setTotalPages] = useState(
    initialData.list?.totalPages ?? 0,
  );
  // 화면에 들고 있는 데이터가 몇 페이지 것인지. 서버가 채워준 페이지에서 출발한다.
  const [loadedPage, setLoadedPage] = useState<number | null>(
    initialData.list ? (initialData.page ?? null) : null,
  );

  const loading = loadedPage !== currentPage;

  useEffect(() => {
    if (loadedPage === currentPage) return;

    let ignore = false;

    fetchPokemonList(currentPage).then((data) => {
      if (ignore) return;
      setPokemons(data.results);
      setTotalPages(data.totalPages);
      setLoadedPage(currentPage);
    });

    return () => {
      ignore = true;
    };
  }, [currentPage, loadedPage]);

  if (loading) {
    return <p className="loading">불러오는 중...</p>;
  }

  return (
    <div>
      <PokemonList pokemons={pokemons} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default PokemonListPage;
