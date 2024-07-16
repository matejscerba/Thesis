import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Product as ProductModel, ProductGroupType } from "../../types/product";
import { fetchPostJson } from "../../utils/api";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";

/**
 * This component renders the group of discarded products.
 *
 * @constructor
 */
function Discarded() {
  const { name, discarded } = useCategory();

  const [data, setData] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    // Load the list of products as soon as the discarded products ids change
    fetchPostJson<ProductModel[]>("discarded", { discarded }, { category_name: name })
      .then((products) => {
        setData(products);
      })
      .catch((e) => console.error(e));
  }, [discarded]);

  return (
    <>
      <Typography variant="h5" className="text-danger mx-3">
        Discarded
      </Typography>
      {data ? (
        <ProductsGroup products={data} groupType={ProductGroupType.DISCARDED} />
      ) : (
        <Typography variant="body1" className="mx-3">
          Loading discarded products...
        </Typography>
      )}
    </>
  );
}

export default Discarded;
