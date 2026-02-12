import { Link } from "react-router-dom";
import "../styles/PokemonCard.css";
import type { PokemonListItem } from "../api/pokemon";

interface Props {
  pokemon: PokemonListItem;
}

const PokemonCard = ({ pokemon }: Props) => {
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} />
      <span className="pokemon-id">
        No.{String(pokemon.id).padStart(4, "0")}
      </span>
      <span className="pokemon-name">{pokemon.name}</span>
    </Link>
  );
};

export default PokemonCard;
