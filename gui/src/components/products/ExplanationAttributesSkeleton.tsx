import React from "react";
import { Skeleton } from "@mui/material";
import { useAttributes } from "../../contexts/attributes";

function ExplanationAttributesSkeleton() {
  const { attributeNames } = useAttributes();

  return (
    <div className="flex-wrapper py-2">
      {attributeNames.map((attribute) => (
        <Skeleton key={attribute} className="flex-item m-1 px-2" sx={{ width: "100px", height: "80px" }} />
      ))}
    </div>
  );
}

export default ExplanationAttributesSkeleton;
