import React from "react";
import "./App.css";
import { ModalContextProvider } from "./contexts/modal";
import Layout from "./Layout";

function App() {
  return (
    <ModalContextProvider>
      <Layout />
    </ModalContextProvider>
  );
}

export default App;
