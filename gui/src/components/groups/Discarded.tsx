import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Product as ProductModel, ProductGroupType } from "../../types/product";
import { fetchPostJson } from "../../utils/api";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";
import CategorySkeleton from "../CategorySkeleton";

export function DiscardedTitle() {
  return (
    <Typography variant="h5" className="text-danger mx-3">
      Discarded
    </Typography>
  );
}

/**
 * This component renders the group of discarded products.
 *
 * @constructor
 */
function Discarded() {
  const { name, discarded } = useCategory();

  const [data, setData] = useState<ProductModel[]>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // Load the list of products as soon as the discarded products ids change
    fetchPostJson<ProductModel[]>("discarded", { discarded }, { category_name: name })
      .then((products) => {
        setLoading(false);
        setData(products);
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, [discarded]);

  if (!data || loading) {
    return <CategorySkeleton title={<DiscardedTitle />} />;
  }

  return (
    <>
      <DiscardedTitle />
      <ProductsGroup products={data} groupType={ProductGroupType.DISCARDED} />
    </>
  );
}

export default Discarded;
