import { useEffect, useState } from "react";
import "../styles/PokemonList.css";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonList, type PokemonListItem } from "../api/pokemon";
import PokemonList from "../components/PokemonList";
import Pagination from "../components/Pagination";

export interface InitialData {
  pokemons: PokemonListItem[];
  totalPages: number;
}

interface Props {
  initialData?: InitialData;
}

const PokemonListPage = ({ initialData }: Props) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const [pokemons, setPokemons] = useState<PokemonListItem[]>(
    initialData?.pokemons ?? [],
  );
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 0);
  const [loading, setLoading] = useState(!initialData);
  const initialPageData = currentPage === 1 ? initialData : undefined;

  useEffect(() => {
    if (initialPageData) {
      return;
    }

    fetchPokemonList(currentPage).then((data) => {
      setPokemons(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }, [currentPage, initialPageData]);

  if (loading) {
    return <p className="loading">불러오는 중...</p>;
  }

  return (
    <div>
      <PokemonList pokemons={initialPageData?.pokemons ?? pokemons} />
      <Pagination
        currentPage={currentPage}
        totalPages={initialPageData?.totalPages ?? totalPages}
      />
    </div>
  );
};

export default PokemonListPage;
