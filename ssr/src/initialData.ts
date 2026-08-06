import { fetchPokemonList, type PokemonListResponse } from "./api/pokemon";

export interface InitialData {
  page?: number;
  list?: PokemonListResponse;
}

export async function loadInitialData(): Promise<InitialData> {
  const page = 1;
  const list = await fetchPokemonList(page);

  return { page, list };
}

// JSON 안의 "</script>" 가 HTML 파싱을 끊어버리는 것을 막는다.
export function serializeInitialData(data: InitialData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
