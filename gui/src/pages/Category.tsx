import React from "react";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";
import ProductList from "../components/products/ProductList";
import CategorySidebar from "../components/CategorySidebar";
import { AttributesContextProvider } from "../contexts/attributes";

interface CategoryProps {
  name: string;
}

function Category({ name }: CategoryProps) {
  return (
    <AttributesContextProvider category={name}>
      <div>
        <Typography variant="h2" className="mb-3" align="center">
          {capitalizeFirstLetter(name)}
        </Typography>
        <div className="category-layout">
          <div className="category-sidebar">
            <CategorySidebar name={name} />
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
