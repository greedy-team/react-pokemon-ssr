import { useRoutes } from "react-router-dom";
import Header from "./components/Header";
import { routes } from "./routes";

const App = () => {
  const element = useRoutes(routes);

  return (
    <>
      <Header />
      {element}
    </>
  );
};

export default App;
