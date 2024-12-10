import React from "react";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";
import ProductList from "../components/products/ProductList";
import CategorySidebar from "../components/CategorySidebar";
import { AttributesContextProvider } from "../contexts/attributes";
import { NavLink, useParams } from "react-router-dom";
import { indexPattern } from "../routes";
import { useConfig } from "../contexts/config";
import { AppFlowType } from "../types/config";

/**
 * This component loads the category page layout.
 *
 * @constructor
 */
function Category() {
  const { name } = useParams();
  const { appFlowType } = useConfig();

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
      {appFlowType === AppFlowType.PRODUCTION && (
        <NavLink to={indexPattern}>
          <i className="bi bi-house home-link" />
        </NavLink>
      )}
    </AttributesContextProvider>
  );
}

export default Category;
