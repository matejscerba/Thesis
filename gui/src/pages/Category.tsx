import React from "react";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";
import ProductList from "../components/products/ProductList";
import CategorySidebar from "../components/CategorySidebar";
import { AttributesContextProvider } from "../contexts/attributes";
import { useParams } from "react-router-dom";

function Category() {
  const { name } = useParams();

  return (
    <AttributesContextProvider category={name}>
      <div>
        <Typography variant="h2" className="mb-3" align="center">
          {capitalizeFirstLetter(name)}
        </Typography>
        <div className="category-layout">
          <div className="category-sidebar">
            <CategorySidebar />
          </div>
          <div className="category-content">
            <ProductList name={name} />
          </div>
        </div>
      </div>
    </AttributesContextProvider>
  );
}

export default Category;
