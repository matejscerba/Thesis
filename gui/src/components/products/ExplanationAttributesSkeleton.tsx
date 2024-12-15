import React from "react";
import { Skeleton } from "@mui/material";
import { useAttributes } from "../../contexts/attributes";

/**
 * This component renders an attribute's skeleton.
 *
 * @constructor
 */
function ExplanationAttributesSkeleton() {
  const { attributeNames } = useAttributes();

  return (
    <div className="flex-wrapper py-2">
      {attributeNames.map((attribute) => (
        <Skeleton key={attribute} className="flex-item m-1 px-2 item-attribute-skeleton" />
      ))}
    </div>
  );
}

export default ExplanationAttributesSkeleton;
