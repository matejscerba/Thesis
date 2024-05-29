import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Product from "../Product";
import React from "react";
import CandidateMenu from "../CandidateMenu";
import { Product as ProductModel } from "../../types/product";

interface CandidatesProps {
  category: string;
  candidates: ProductModel[];
  onDiscard: (id: number) => void;
}

function Candidates({ category, candidates, onDiscard }: CandidatesProps) {
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
              category={category}
              menu={<CandidateMenu product={product} onDiscard={onDiscard} />}
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
