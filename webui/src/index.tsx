import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import JoinGame from "./components/JoinGame";

const App = () => {
  const [username, setUsername] = useState("");

  return (
    <div>
      <h1>Coup ONLINE</h1>
      {username ? <h2>The game will start shortly...</h2> : <JoinGame />}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
