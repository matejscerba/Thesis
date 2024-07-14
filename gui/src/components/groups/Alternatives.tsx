import Typography from "@mui/material/Typography";
import React from "react";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";
import { ProductGroupType } from "../../types/product";

function Alternatives() {
  const { alternatives } = useCategory();

  return (
    <>
      <Typography variant="h5" className="text-primary mx-3">
        Alternatives
      </Typography>
      <ProductsGroup products={alternatives} groupType={ProductGroupType.ALTERNATIVES} />
    </>
  );
}

export default Alternatives;
