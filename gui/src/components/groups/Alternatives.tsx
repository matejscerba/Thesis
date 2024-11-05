import Typography from "@mui/material/Typography";
import React from "react";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";
import { ProductGroupType } from "../../types/product";

export function AlternativesTitle() {
  return (
    <Typography variant="h5" className="text-primary mx-3">
      Alternatives
    </Typography>
  );
}

/**
 * This component renders the group of alternative products.
 *
 * @constructor
 */
function Alternatives() {
  const { alternatives } = useCategory();

  return (
    <>
      <AlternativesTitle />
      <ProductsGroup products={alternatives} groupType={ProductGroupType.ALTERNATIVES} />
    </>
  );
}

export default Alternatives;
