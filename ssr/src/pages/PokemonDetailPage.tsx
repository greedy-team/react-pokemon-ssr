import { useEffect, useState } from "react";
import "../styles/PokemonDetail.css";
import { useParams, Link } from "react-router-dom";
import {
  fetchPokemonDetail,
  type PokemonDetail as PokemonDetailType,
} from "../api/pokemon";
import { useInitialData } from "../context/InitialDataContext";

const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentId = Number(id);

  const initialData = useInitialData();
  const preloaded =
    initialData.detailId === currentId ? initialData.detail : undefined;

  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(
    preloaded ?? null,
  );
  // 화면에 들고 있는 데이터가 어떤 포켓몬 것인지. 서버가 채워준 값에서 출발한다.
  const [loadedId, setLoadedId] = useState<number | null>(
    preloaded ? currentId : null,
  );

  const loading = loadedId !== currentId || !pokemon;

  useEffect(() => {
    if (loadedId === currentId) return;

    let ignore = false;

    fetchPokemonDetail(currentId).then((data) => {
      if (ignore) return;
      setPokemon(data);
      setLoadedId(currentId);
    });

    return () => {
      ignore = true;
    };
  }, [currentId, loadedId]);

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
