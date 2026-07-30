import { hydrateRoot } from "react-dom/client";
import App from "../../ssr/src/App";

hydrateRoot(document.getElementById("root")!, <App />);
