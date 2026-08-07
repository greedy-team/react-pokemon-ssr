import { useEffect, useState, useRef } from "react";
import "../styles/PokemonList.css";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonList, type PokemonListItem } from "../api/pokemon";
import PokemonList from "../components/PokemonList";
import Pagination from "../components/Pagination";

interface PokemonListPageProps {
  initialData?: {
    results: PokemonListItem[];
    totalPages: number;
  };
}

const PokemonListPage = ({ initialData }: PokemonListPageProps) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const [pokemons, setPokemons] = useState<PokemonListItem[]>(
    initialData?.results || [],
  );
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 0);
  const [loading, setLoading] = useState(!initialData);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (initialData && isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setLoading(true);
    fetchPokemonList(currentPage).then((data) => {
      setPokemons(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }, [currentPage]);

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
