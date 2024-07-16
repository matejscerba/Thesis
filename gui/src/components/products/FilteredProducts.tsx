import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import AlternativeMenu from "../menus/AlternativeMenu";
import { fetchPostJson } from "../../utils/api";
import { Product as ProductModel } from "../../types/product";
import Product from "./Product";
import Typography from "@mui/material/Typography";
import { Attribute } from "../../types/attribute";
import { valueToString } from "../../utils/attributes";
import { useCategory } from "../../contexts/category";

interface FilteredProductsProps {
  attribute: Attribute;
  value: {
    lowerBound?: number;
    upperBound?: number;
    options?: any[];
  };
}

/**
 * This component filters the products based on the value provided.
 *
 * @param attribute attribute over which the filter is to be applied
 * @param value the filter value - giving the range or possible options
 * @constructor
 */
function FilteredProducts({ attribute, value }: FilteredProductsProps) {
  const { name, candidateIds, discarded } = useCategory();

  const [products, setProducts] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    // Filter the products as soon as candidates or discarded ids change
    fetchPostJson<ProductModel[]>(
      "category/filter",
      {
        attribute: attribute.full_name,
        value: {
          lower_bound: value.lowerBound,
          upper_bound: value.upperBound,
          options: value.options,
        },
        candidates: candidateIds,
        discarded,
      },
      { category_name: name },
    )
      .then((response) => {
        setProducts(response);
      })
      .catch((e) => console.error(e));
  }, [candidateIds, discarded]);

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
            menu={<AlternativeMenu product={product} />}
          />
        ))}
      </List>
    </>
  );
}

export default FilteredProducts;
