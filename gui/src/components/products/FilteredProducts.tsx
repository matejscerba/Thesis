import List from "@mui/material/List";
import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { Product as ProductModel } from "../../types/product";
import Product from "./Product";
import Typography from "@mui/material/Typography";
import { MultiFilter } from "../../types/attribute";
import { useCategory } from "../../contexts/category";
import { getFilterText } from "../../utils/attributes";
import FilteredMenu from "../menus/FilteredMenu";
import { useProductsQueue } from "../../contexts/productsQueue";

interface FilteredProductsProps {
  filter: MultiFilter;
}

/**
 * This component filters the products based on the filter provided.
 *
 * @param {FilteredProductsProps} props
 * @param {MultiFilter} props.filter the filter to be applied
 * @constructor
 */
function FilteredProducts({ filter }: FilteredProductsProps) {
  const { queuedCandidates, queuedDiscarded, onQueueCandidate, onQueueDiscarded } = useProductsQueue();
  const { name, candidateIds, discarded } = useCategory();

  const [products, setProducts] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    // Filter the products as soon as candidates or discarded ids change
    fetchPostJson<ProductModel[]>(
      "category/filter",
      {
        filter: filter.map((item) => ({
          attribute_name: item.attribute.full_name,
          filter: {
            lower_bound: item.filter.lowerBound,
            upper_bound: item.filter.upperBound,
            options: item.filter.options,
          },
        })),
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
        Products with {getFilterText(filter)}
      </Typography>
      {products.length > 0 ? (
        <List>
          {products.map((product) => (
            <Product
              className="border border-secondary rounded bg-white"
              key={`${product.id}`}
              product={product}
              menu={
                <FilteredMenu
                  product={product}
                  filter={filter}
                  onMarkCandidate={onQueueCandidate}
                  onDiscard={onQueueDiscarded}
                  isCandidate={queuedCandidates.includes(product.id)}
                  isDiscarded={queuedDiscarded.includes(product.id)}
                />
              }
            />
          ))}
        </List>
      ) : (
        <Typography variant="body1" className="m-2">
          There are no products satisfying the filter above.
        </Typography>
      )}
    </>
  );
}

export default FilteredProducts;
