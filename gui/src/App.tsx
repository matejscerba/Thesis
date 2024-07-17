import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Category from "./pages/Category";
import Categories from "./pages/Categories";

/**
 * This component renders the app and uses React router to navigate through pages.
 *
 * @constructor
 */
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

  return <RouterProvider router={router} />;
}

export default App;
