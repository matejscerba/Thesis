import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Product from "../Product";
import React from "react";
import { Product as ProductModel } from "../../types/product";
import AlternativeMenu from "../AlternativeMenu";

interface AlternativesProps {
  category: string;
  alternatives: ProductModel[];
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function Alternatives({ category, alternatives, onDiscard, onMarkCandidate }: AlternativesProps) {
  return (
    <>
      <Typography variant="h5" className="text-info mx-3">
        Alternatives
      </Typography>
      <List>
        {alternatives.map((product) => (
          <Product
            className="border border-info rounded bg-white"
            key={`${product.id}`}
            product={product}
            category={category}
            menu={<AlternativeMenu product={product} onDiscard={onDiscard} onMarkCandidate={onMarkCandidate} />}
          />
        ))}
      </List>
    </>
  );
}

export default Alternatives;
