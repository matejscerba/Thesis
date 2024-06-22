import { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { useAttributes } from "../../contexts/attributes";
import { useCategory } from "../../contexts/category";
import Typography from "@mui/material/Typography";
import { ProductExplanation } from "../../types/product";
import React from "react";

interface ExplanationsProps {
  productId: number;
}

function Explanations({ productId }: ExplanationsProps) {
  const { attributeNames } = useAttributes();
  const { name, candidateIds, discarded } = useCategory();

  const [explanation, setExplanation] = useState<ProductExplanation>(undefined);

  useEffect(() => {
    fetchPostJson<ProductExplanation>(
      "explanation",
      { candidates: candidateIds, discarded, important_attributes: attributeNames },
      { category_name: name, product_id: `${productId}` },
    )
      .then((result) => {
        setExplanation(result);
      })
      .catch((e) => console.error(e));
  }, [candidateIds, discarded]);

  if (explanation === undefined) {
    return null;
  }

  return (
    <div className="explanation-wrapper py-1 px-2">
      <Typography variant="body1">{explanation.message}</Typography>
    </div>
  );
}

export default Explanations;
