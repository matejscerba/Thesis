import React from "react";
import ItemSkeleton from "./ItemSkeleton";

interface CategorySkeletonProps {
  title?: React.ReactNode;
  numItems?: number;
}

function CategorySkeleton({ title, numItems = 3 }: CategorySkeletonProps) {
  return (
    <>
      {title}
      {Array(numItems).map((_, i) => (
        <ItemSkeleton key={`${i}`} />
      ))}
    </>
  );
}

export default CategorySkeleton;
