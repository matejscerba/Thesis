import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import { ConfigContextProvider } from "./contexts/config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="content bg-light">
      <ConfigContextProvider>
        <App />
      </ConfigContextProvider>
    </div>
  </React.StrictMode>,
);
