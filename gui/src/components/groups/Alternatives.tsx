import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Product from "../products/Product";
import React from "react";
import AlternativeMenu from "../menus/AlternativeMenu";
import { useCategory } from "../../contexts/category";

function Alternatives() {
  const { alternatives } = useCategory();

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
            menu={<AlternativeMenu product={product} />}
            showExplanation
          />
        ))}
      </List>
    </>
  );
}

export default Alternatives;
