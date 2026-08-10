import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { InitialDataProvider } from "./context/InitialDataContext";
import type { InitialData } from "./initialData";
import "./styles/global.css";

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

// 이미 값이 있는 promise. status/value를 채워두면 use()가 중단 없이 바로 읽는다.
// 이게 없으면 hydration 중에 fallback이 한 번 스쳐 지나간다.
function settled(value: InitialData): Promise<InitialData> {
  const promise = Promise.resolve(value) as Promise<InitialData> & {
    status: string;
    value: InitialData;
  };
  promise.status = "fulfilled";
  promise.value = value;

  return promise;
}

const dataPromise = settled(window.__INITIAL_DATA__ ?? {});

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <InitialDataProvider dataPromise={dataPromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InitialDataProvider>
  </StrictMode>,
);
