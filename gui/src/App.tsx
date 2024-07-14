import React from "react";
import "./App.css";
import { ModalContextProvider } from "./contexts/modal";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Category from "./pages/Category";
import Categories from "./pages/Categories";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Categories />,
    },
    {
      path: "/category/:name",
      element: <Category />,
    },
  ]);

  return (
    <ModalContextProvider>
      <RouterProvider router={router} />
    </ModalContextProvider>
  );
}

export default App;
