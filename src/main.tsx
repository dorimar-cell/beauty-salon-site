import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/prata/400.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";

import "./styles.css";
import "./styles-v2.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
