import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { Product as ProductModel } from "../types/product";
import React, { useEffect, useState } from "react";
import Product from "./Product";
import AlternativeMenu from "./AlternativeMenu";
import CandidateMenu from "./CandidateMenu";
import DiscardedMenu from "./DiscardedMenu";
import { fetchPostJson } from "../utils/api";

interface OrganizedCategoryProps {
  name: string;
  candidates: ProductModel[];
  alternatives: ProductModel[];
  unseen: ProductModel[];
  discarded: number[];
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function OrganizedCategory({
  name,
  candidates,
  alternatives,
  unseen,
  discarded,
  onDiscard,
  onMarkCandidate,
}: OrganizedCategoryProps) {
  const [data, setData] = useState<ProductModel[]>(undefined);

  const getCandidateMenu = (product: ProductModel) => {
    return <CandidateMenu product={product} onDiscard={onDiscard} />;
  };

  const getAlternativeMenu = (product: ProductModel) => {
    return <AlternativeMenu product={product} onDiscard={onDiscard} onMarkCandidate={onMarkCandidate} />;
  };

  const getDiscardedMenu = (product: ProductModel) => {
    return <DiscardedMenu product={product} onMarkCandidate={onMarkCandidate} />;
  };

  useEffect(() => {
    fetchPostJson<ProductModel[]>("discarded", { discarded }, { name })
      .then((products) => {
        setData(products);
      })
      .catch((e) => console.error(e));
  }, [candidates, discarded]);

  return (
    <div>
      <div className="mb-3">
        <Typography variant="h5" className="text-success mx-3">
          Candidates
        </Typography>
        <>
          {candidates.length ? (
            <List>
              {candidates.map((product) => (
                <Product
                  className="border border-success rounded bg-white"
                  key={`${product.id}`}
                  product={product}
                  category={name}
                  getMenu={getCandidateMenu}
                />
              ))}
            </List>
          ) : (
            <Typography variant="body1" className="mx-3">
              There are no candidates
            </Typography>
          )}
        </>
      </div>
      <div className="mb-3">
        <Typography variant="h5" className="text-secondary mx-3">
          Unseen
        </Typography>
        <Typography variant="body1" className="mx-3">
          Here will be statistics about the unseen products
        </Typography>
        <pre className="mx-3">{JSON.stringify(unseen)}</pre>
      </div>
      <div className="mb-3">
        <Typography variant="h5" className="text-info mx-3">
          Alternatives
        </Typography>
        <List>
          {alternatives.map((product) => (
            <Product
              className="border border-info rounded bg-white"
              key={`${product.id}`}
              product={product}
              category={name}
              getMenu={getAlternativeMenu}
            />
          ))}
        </List>
      </div>
      <div className="mb-3">
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
                  category={name}
                  getMenu={getDiscardedMenu}
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
      </div>
    </div>
  );
}

export default OrganizedCategory;
