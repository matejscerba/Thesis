import React from "react";
import { Skeleton } from "@mui/material";

/**
 * This component renders skeleton of a category section item.
 *
 * @constructor
 */
function ItemSkeleton() {
  return (
    <div className="m-3 item-skeleton-wrapper">
      <Skeleton className="item-skeleton border-radius" component="div" />
    </div>
  );
}

export default ItemSkeleton;
