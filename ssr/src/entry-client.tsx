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

// 서버가 심어둔 데이터를 그대로 초기 상태로 쓴다. 다시 fetch하면 hydration 결과가 달라진다.
const initialData = window.__INITIAL_DATA__ ?? {};

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <InitialDataProvider data={initialData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InitialDataProvider>
  </StrictMode>,
);
