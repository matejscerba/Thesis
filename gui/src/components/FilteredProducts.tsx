import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import AlternativeMenu from "./AlternativeMenu";
import { fetchPostJson } from "../utils/api";
import { useGroups } from "../contexts/groups";
import { Product as ProductModel } from "../types/product";
import Product from "./Product";
import Typography from "@mui/material/Typography";
import { Attribute } from "../types/attribute";
import { valueToString } from "../utils/attributes";

interface FilteredProductsProps {
  category: string;
  attribute: Attribute;
  value: {
    lowerBound?: number;
    upperBound?: number;
    options?: any[];
  };
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function FilteredProducts({ category, attribute, value, onDiscard, onMarkCandidate }: FilteredProductsProps) {
  const { candidates, discarded } = useGroups();

  const [products, setProducts] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    fetchPostJson<ProductModel[]>(
      "category/filter",
      {
        attribute: attribute.full_name,
        value: {
          lower_bound: value.lowerBound,
          upper_bound: value.upperBound,
          options: value.options,
        },
        candidates,
        discarded,
      },
      { category_name: category },
    )
      .then((response) => {
        setProducts(response);
      })
      .catch((e) => console.error(e));
  }, [candidates, discarded]);

  if (!products) {
    return <pre>Loading...</pre>;
  }

  return (
    <>
      <Typography variant="h5" className="text-secondary mx-3">
        Products with {attribute.name}{" "}
        {value.options
          ? `equal to ${value.options.map((val) => valueToString(val, attribute)).join(", ")}`
          : `between ${valueToString(value.lowerBound, attribute)} and ${valueToString(value.upperBound, attribute)}`}
      </Typography>
      <List>
        {products.map((product) => (
          <Product
            className="border border-secondary rounded bg-white"
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

export default FilteredProducts;
