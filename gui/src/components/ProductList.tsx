import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";
import { Product } from "../types/product";
import Candidates from "./groups/Candidates";
import Typography from "@mui/material/Typography";
import Alternatives from "./groups/Alternatives";
import Discarded from "./groups/Discarded";

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

  const onDiscard = (id: number) => {
    if (candidates.includes(id)) {
      setCandidates((prevState) => prevState.filter((candidate) => candidate !== id));
    }
    setDiscarded((prevState) => [...prevState, id]);
  };
  const onMarkCandidate = (id: number) => {
    if (discarded.includes(id)) {
      setDiscarded((prevState) => prevState.filter((discarded) => discarded !== id));
    }
    setCandidates((prevState) => [...prevState, id]);
  };

  if (!data) {
    return <pre>Loading...</pre>;
  }

  if (!data.organized) {
    return <pre>unorganized {JSON.stringify(data)}</pre>;
  }

  return (
    <div>
      <div className="mb-3">
        <Candidates category={name} candidates={data.candidates} onDiscard={onDiscard} />
      </div>
      <div className="mb-3">
        <Typography variant="h5" className="text-secondary mx-3">
          Unseen
        </Typography>
        <Typography variant="body1" className="mx-3">
          Here will be statistics about the unseen products
        </Typography>
        <pre className="mx-3">{JSON.stringify(data.unseen)}</pre>
      </div>
      <div className="mb-3">
        <Alternatives
          category={name}
          alternatives={data.alternatives}
          onDiscard={onDiscard}
          onMarkCandidate={onMarkCandidate}
        />
      </div>
      <div className="mb-3">
        <Discarded category={name} discarded={discarded} onMarkCandidate={onMarkCandidate} />
      </div>
    </div>
  );
}

export default ProductList;
