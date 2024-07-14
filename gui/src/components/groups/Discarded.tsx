import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Product as ProductModel, ProductGroupType } from "../../types/product";
import { fetchPostJson } from "../../utils/api";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";

function Discarded() {
  const { name, discarded } = useCategory();

  const [data, setData] = useState<ProductModel[]>(undefined);

  useEffect(() => {
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
