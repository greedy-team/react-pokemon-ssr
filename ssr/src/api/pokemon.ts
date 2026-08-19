import { BASE_URL, PAGE_SIZE } from "../constants";

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
  totalPages: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

const getPokemonImageURL = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export async function fetchPokemonList(
  page: number = 1,
): Promise<PokemonListResponse> {
  const offset = (page - 1) * PAGE_SIZE;
  const response = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${PAGE_SIZE}`,
  );

  if (!response.ok) {
    throw new Error(
      `포켓몬 목록을 불러오지 못했습니다. (Status: ${response.status})`,
    );
  }

  const data = await response.json();

  const results: PokemonListItem[] = data.results.map(
    (pokemon: { name: string; url: string }) => {
      const id = Number(pokemon.url.split("/").filter(Boolean).pop());
      return {
        name: pokemon.name,
        url: pokemon.url,
        id,
        image: getPokemonImageURL(id),
      };
    },
  );

  return {
    count: data.count,
    results,
    totalPages: Math.ceil(data.count / PAGE_SIZE),
  };
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(
      `포켓몬 상세 정보를 불러오지 못했습니다. (Status: ${response.status})`,
    );
  }

  const pokemon = await response.json();

  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default,
    types: pokemon.types.map((t: { type: { name: string } }) => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    stats: pokemon.stats.map(
      (s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        value: s.base_stat,
      }),
    ),
  };
}
