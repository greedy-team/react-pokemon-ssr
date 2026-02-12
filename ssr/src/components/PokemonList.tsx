import "../styles/PokemonList.css";
import type { PokemonListItem } from "../api/pokemon";
import PokemonCard from "./PokemonCard";

interface Props {
  pokemons: PokemonListItem[];
}

const PokemonList = ({ pokemons }: Props) => {
  return (
    <div className="pokemon-grid">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
