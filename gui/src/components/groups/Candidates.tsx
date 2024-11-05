import Typography from "@mui/material/Typography";
import React from "react";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";
import { ProductGroupType } from "../../types/product";

export function CandidatesTitle() {
  return (
    <Typography variant="h5" className="text-success mx-3">
      Candidates
    </Typography>
  );
}

/**
 * This component renders the group of candidate products.
 *
 * @constructor
 */
function Candidates() {
  const { candidates } = useCategory();

  return (
    <>
      <CandidatesTitle />
      <ProductsGroup products={candidates} groupType={ProductGroupType.CANDIDATES} />
    </>
  );
}

export default Candidates;
