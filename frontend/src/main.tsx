import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/globals.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "[Prompt2Form] Failed to find #root element. Check your index.html.",
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
