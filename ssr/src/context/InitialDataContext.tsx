import { createContext, use, useContext } from "react";
import type { ReactNode } from "react";
import type { InitialData } from "../initialData";

const InitialDataContext = createContext<Promise<InitialData> | null>(null);

export function InitialDataProvider({
  dataPromise,
  children,
}: {
  dataPromise: Promise<InitialData>;
  children: ReactNode;
}) {
  return (
    <InitialDataContext.Provider value={dataPromise}>
      {children}
    </InitialDataContext.Provider>
  );
}

// use()는 promise가 아직 대기 중이면 컴포넌트를 중단시킨다.
// 서버는 그 사이 Suspense fallback을 먼저 흘려보내고, 준비되면 실제 내용을 이어 보낸다.
// eslint-disable-next-line react-refresh/only-export-components
export function useInitialData(): InitialData {
  const dataPromise = useContext(InitialDataContext);
  if (!dataPromise) return {};

  return use(dataPromise);
}
