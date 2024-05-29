import Typography from "@mui/material/Typography";
import Product from "../Product";
import React, { useEffect, useState } from "react";
import { Product as ProductModel } from "../../types/product";
import DiscardedMenu from "../DiscardedMenu";
import { fetchPostJson } from "../../utils/api";

interface DiscardedProps {
  category: string;
  discarded: number[];
  onMarkCandidate: (id: number) => void;
}

function Discarded({ category, discarded, onMarkCandidate }: DiscardedProps) {
  const [data, setData] = useState<ProductModel[]>(undefined);

  useEffect(() => {
    fetchPostJson<ProductModel[]>("discarded", { discarded }, { name: category })
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
        <>
          {data.length ? (
            data.map((product) => (
              <Product
                className="border border-danger rounded bg-white"
                key={`${product.id}`}
                product={product}
                category={category}
                menu={<DiscardedMenu product={product} onMarkCandidate={onMarkCandidate} />}
              />
            ))
          ) : (
            <Typography variant="body1" className="mx-3">
              There are no discarded products
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body1" className="mx-3">
          Loading discarded products...
        </Typography>
      )}
    </>
  );
}

export default Discarded;
