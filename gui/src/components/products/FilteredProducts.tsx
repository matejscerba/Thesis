import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import AlternativeMenu from "../menus/AlternativeMenu";
import { fetchPostJson } from "../../utils/api";
import { Product as ProductModel } from "../../types/product";
import Product from "./Product";
import Typography from "@mui/material/Typography";
import { Attribute, FilterValue } from "../../types/attribute";
import { getFilterValueText } from "../../utils/attributes";
import { useCategory } from "../../contexts/category";

interface FilteredProductsProps {
  attribute: Attribute;
  value: FilterValue;
}

/**
 * This component filters the products based on the value provided.
 *
 * @param {Attribute} attribute attribute over which the filter is to be applied
 * @param {FilterValue} value the filter value - giving the range or possible options
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
        Products with {attribute.name} {getFilterValueText(attribute, value)}
      </Typography>
      {products.length > 0 ? (
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
      ) : (
        <Typography variant="body1" className="m-2">
          There are no products satisfying the filter mentioned above.
        </Typography>
      )}
    </>
  );
}

export default FilteredProducts;
