import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Product from "../products/Product";
import React from "react";
import CandidateMenu from "../menus/CandidateMenu";
import { useCategory } from "../../contexts/category";

function Candidates() {
  const { candidates } = useCategory();

  return (
    <>
      <Typography variant="h5" className="text-success mx-3">
        Candidates
      </Typography>
      {candidates.length ? (
        <List>
          {candidates.map((product) => (
            <Product
              className="border border-success rounded bg-white"
              key={`${product.id}`}
              product={product}
              menu={<CandidateMenu product={product} />}
              showExplanation
            />
          ))}
        </List>
      ) : (
        <Typography variant="body1" className="mx-3">
          There are no candidates
        </Typography>
      )}
    </>
  );
}

export default Candidates;
