import { matchRoutes } from "react-router-dom";
import { routes } from "./routes";
import { fetchPokemonList, type PokemonListResponse } from "./api/pokemon";

export interface InitialData {
  page?: number;
  list?: PokemonListResponse;
}

export async function loadInitialData(url: string): Promise<InitialData> {
  const [pathname, search = ""] = url.split("?");
  // 라우트 정의를 그대로 재사용한다. 서버가 URL을 따로 해석하면 클라이언트와 어긋난다.
  const match = matchRoutes(routes, pathname)?.[0];

  if (!match) return {};

  try {
    if (match.route.path === "/") {
      const page = Number(new URLSearchParams(search).get("page") || "1");
      const list = await fetchPokemonList(page);

      return { page, list };
    }
  } catch {
    // 미리 가져오기에 실패해도 응답 자체는 내보낸다. 클라이언트가 다시 시도한다.
    return {};
  }

  return {};
}

// JSON 안의 "</script>" 가 HTML 파싱을 끊어버리는 것을 막는다.
export function serializeInitialData(data: InitialData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
