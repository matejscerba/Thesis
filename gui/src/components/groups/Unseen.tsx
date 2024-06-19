import Typography from "@mui/material/Typography";
import React from "react";
import { useAttributes } from "../../contexts/attributes";
import NumericalAttributeRange from "../NumericalAttributeRange";
import CategoricalAttributeRange from "../CategoricalAttributeRange";

interface UnseenProps {
  category: string;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function Unseen({ category, onDiscard, onMarkCandidate }: UnseenProps) {
  const { attributes } = useAttributes();
  return (
    <>
      <Typography variant="h5" className="text-secondary mx-3">
        Unseen
      </Typography>
      {attributes.map((attribute) => (
        <div key={attribute.name} className="m-3 border border-secondary rounded">
          <Typography variant="h6" className="mx-2">
            {attribute.name}
          </Typography>
          {attribute.type === "categorical" ? (
            <CategoricalAttributeRange
              category={category}
              attribute={attribute}
              options={["5500M", "5300M"]}
              numProductsInRange={5}
              onDiscard={onDiscard}
              onMarkCandidate={onMarkCandidate}
            />
          ) : (
            <NumericalAttributeRange
              category={category}
              attribute={attribute}
              lowerBound={8}
              upperBound={16}
              numProductsInRange={5}
              onDiscard={onDiscard}
              onMarkCandidate={onMarkCandidate}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default Unseen;
