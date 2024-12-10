import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import { Product as ProductModel, ProductGroupType } from "../../types/product";
import { fetchPostJson } from "../../utils/api";
import { useCategory } from "../../contexts/category";
import ProductsGroup from "./ProductsGroup";
import CategorySkeleton from "../CategorySkeleton";
import { useInViewport } from "react-in-viewport";

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

  const viewportSectionRef = useRef();
  const { inViewport } = useInViewport(viewportSectionRef);

  useEffect(() => {
    if (inViewport) {
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
    }
  }, [discarded, inViewport]);

  return (
    <section ref={viewportSectionRef}>
      {!data || loading ? (
        <CategorySkeleton title={<DiscardedTitle />} numItems={discarded.length} />
      ) : (
        <>
          <DiscardedTitle />
          <ProductsGroup products={data} groupType={ProductGroupType.DISCARDED} />
        </>
      )}
    </section>
  );
}

export default Discarded;
