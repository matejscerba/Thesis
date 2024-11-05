import React from "react";
import { Skeleton } from "@mui/material";

function ItemSkeleton() {
  return (
    <div className="m-3" style={{ height: 190 }}>
      <Skeleton
        height={190}
        style={{
          transform: "scale(1, 1)",
          borderRadius: "var(--bs-border-radius) !important",
        }}
        component="div"
      />
    </div>
  );
}

export default ItemSkeleton;
