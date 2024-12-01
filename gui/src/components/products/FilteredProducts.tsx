import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import AlternativeMenu from "../menus/AlternativeMenu";
import { fetchPostJson } from "../../utils/api";
import { Product as ProductModel } from "../../types/product";
import Product from "./Product";
import Typography from "@mui/material/Typography";
import { MultiFilter } from "../../types/attribute";
import { useCategory } from "../../contexts/category";
import { getFilterText } from "../../utils/attributes";

interface FilteredProductsProps {
  filter: MultiFilter;
}

/**
 * This component filters the products based on the value provided.
 *
 * @param {Attribute} attribute attribute over which the filter is to be applied
 * @param {FilterValue} value the filter value - giving the range or possible options
 * @constructor
 */
function FilteredProducts({ filter }: FilteredProductsProps) {
  const { candidateIds, discarded } = useCategory();

  const [products, setProducts] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    // Filter the products as soon as candidates or discarded ids change
    fetchPostJson<ProductModel[]>("category/filter", {
      filter: filter.map((item) => ({
        attribute_name: item.attribute.full_name,
        filter: {
          lower_bound: item.filter.lowerBound,
          upper_bound: item.filter.upperBound,
          options: item.filter.options,
        },
      })),
    })
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
        Products with {getFilterText(filter)}
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
