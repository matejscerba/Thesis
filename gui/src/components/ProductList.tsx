import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";
import OrganizedCategory from "./OrganizedCategory";
import { Product } from "../types/product";

interface ProductListResponse {
  organized: boolean;
  products?: Product[];
  candidates?: Product[];
  alternatives?: Product[];
  unseen?: Product[];
}

interface ProductListProps {
  name: string;
}

function ProductList({ name }: ProductListProps) {
  const [data, setData] = useState<ProductListResponse>(undefined);
  const [candidates, setCandidates] = useState<number[]>([1, 2, 3, 4, 5]);
  const [discarded, setDiscarded] = useState<number[]>([6, 7, 8, 9, 10]);

  useEffect(() => {
    fetchPostJson<ProductListResponse>("category", { candidates, discarded }, { name })
      .then((category) => {
        setData(category);
      })
      .catch((e) => console.error(e));
  }, [candidates, discarded]);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  if (!data.organized) {
    return <pre>unorganized {JSON.stringify(data)}</pre>;
  }

  return (
    <OrganizedCategory
      name={name}
      candidates={data.candidates}
      alternatives={data.alternatives}
      unseen={data.unseen}
      discarded={discarded}
      onDiscard={(id: number) => {
        if (candidates.includes(id)) {
          setCandidates((prevState) => prevState.filter((candidate) => candidate !== id));
        }
        setDiscarded((prevState) => [...prevState, id]);
      }}
      onMarkCandidate={(id: number) => {
        if (discarded.includes(id)) {
          setDiscarded((prevState) => prevState.filter((discarded) => discarded !== id));
        }
        setCandidates((prevState) => [...prevState, id]);
      }}
    />
  );
}

export default ProductList;
