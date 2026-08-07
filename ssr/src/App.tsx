import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Header from "./components/Header";
import { routes } from "./routes";

const App = () => {
  const element = useRoutes(routes);

  // 루트를 Fragment로 두면 스트리밍 시 쉘이 먼저 전송되지 않는다.
  // 단일 요소로 감싸야 React가 Suspense 바깥을 즉시 흘려보낼 수 있다.
  return (
    <div className="app">
      <Header />
      <Suspense fallback={<p className="loading">불러오는 중...</p>}>
        {element}
      </Suspense>
    </div>
  );
};

export default App;
