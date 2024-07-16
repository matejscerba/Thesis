import React from "react";
import ImportantAttributesMenu from "./menus/ImportantAttributesMenu";

/**
 * This component renders the sidebar (left column) of a category.
 *
 * @constructor
 */
function CategorySidebar() {
  return (
    <div className="border border-secondary rounded bg-white p-2 my-2">
      <ImportantAttributesMenu />
    </div>
  );
}

export default CategorySidebar;
