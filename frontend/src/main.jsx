import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { wakeUpBackend } from "./utils/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//levantamos el servidor (no hace falta esperar respuesta)
wakeUpBackend();