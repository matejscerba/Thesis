import React from "react";

interface CategorySidebarProps {
  name: string;
}

function CategorySidebar({ name }: CategorySidebarProps) {
  return <div className="border border-secondary rounded bg-white p-2">Here will be menu for category {name}</div>;
}

export default CategorySidebar;
