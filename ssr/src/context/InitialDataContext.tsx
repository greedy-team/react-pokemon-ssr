import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { InitialData } from "../initialData";

const InitialDataContext = createContext<InitialData>({});

export function InitialDataProvider({
  data,
  children,
}: {
  data: InitialData;
  children: ReactNode;
}) {
  return (
    <InitialDataContext.Provider value={data}>
      {children}
    </InitialDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInitialData() {
  return useContext(InitialDataContext);
}
