import { useEffect, useState } from "react";
import "../styles/PokemonDetail.css";
import { useParams, Link } from "react-router-dom";
import {
  fetchPokemonDetail,
  type PokemonDetail as PokemonDetailType,
} from "../api/pokemon";
interface Props {
  initialData?: PokemonDetailType;
}
const PokemonDetailPage = ({ initialData }: Props) => {
  const { id } = useParams<{ id: string }>();
  const initialPokemon = initialData?.id === Number(id) ? initialData : null;
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(
    initialPokemon,
  );
  const [loading, setLoading] = useState(!initialPokemon);

  useEffect(() => {
    if (initialPokemon) {
      return;
    }

    fetchPokemonDetail(Number(id)).then((pokemonData) => {
      setPokemon(pokemonData);
      setLoading(false);
    });
  }, [id, initialPokemon]);

  if (loading || !pokemon) {
    return <p className="loading">불러오는 중...</p>;
  }

  return (
    <div className="detail">
      <Link to="/" className="back-link">
        ← 목록으로
      </Link>
      <div className="detail-card">
        <img src={pokemon.image} alt={pokemon.name} />
        <h1>{pokemon.name}</h1>
        <p className="detail-id">No.{String(pokemon.id).padStart(4, "0")}</p>
        <div className="types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
        <div className="detail-info">
          <p>키: {pokemon.height / 10}m</p>
          <p>몸무게: {pokemon.weight / 10}kg</p>
        </div>
        <div className="stats">
          <h2>능력치</h2>
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="stat-row">
              <span className="stat-name">{stat.name}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${Math.min(stat.value, 200) / 2}%` }}
                />
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
