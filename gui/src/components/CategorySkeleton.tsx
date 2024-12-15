import React from "react";
import ItemSkeleton from "./ItemSkeleton";

interface CategorySkeletonProps {
  title?: React.ReactNode;
  numItems?: number;
}

/**
 * This component renders skeleton of a category section (list of products).
 *
 * @param {CategorySkeletonProps} props
 * @param {React.ReactNode} props.title the title of the section
 * @param {number} props.numItems the number of items to display skeletons for
 * @constructor
 */
function CategorySkeleton({ title, numItems = 3 }: CategorySkeletonProps) {
  return (
    <>
      {title}
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      {[...Array(numItems)].map((_, i) => (
        <ItemSkeleton key={`${i}`} />
      ))}
    </>
  );
}

export default CategorySkeleton;
