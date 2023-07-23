import { createRoot } from "react-dom/client";
import React from "react";
import Game from "./components/Game";
import "./styles/main.scss";

const App = () => {
  return <Game />;
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
