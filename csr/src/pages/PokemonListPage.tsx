import { useEffect, useState } from "react";
import "../styles/PokemonList.css";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonList, type PokemonListItem } from "../api/pokemon";
import PokemonList from "../components/PokemonList";
import Pagination from "../components/Pagination";

type Props = {
  initialData?: {
    results: PokemonListItem[];
    totalPages: number;
  };
};

const PokemonListPage = ({ initialData }: Props) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const isValidInitialData = !!initialData && "results" in initialData;

  const [pokemons, setPokemons] = useState<PokemonListItem[]>(
    isValidInitialData ? initialData.results : [],
  );
  const [totalPages, setTotalPages] = useState(
    isValidInitialData ? initialData.totalPages : 0,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isValidInitialData) {
      return;
    }

    fetchPokemonList(currentPage).then((data) => {
      setLoading(true);
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
