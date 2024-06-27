import React from "react";
import { useAttributes } from "../../contexts/attributes";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";

function ImportantAttributesMenu() {
  const { attributes, restAttributes, addAttribute, removeAttribute } = useAttributes();

  return (
    <>
      <Typography variant="h5">Important attributes</Typography>
      <div className="flex-wrapper">
        {attributes?.map((attribute) => (
          <Tooltip key={attribute.full_name} title="Remove from important attributes">
            <div
              className="removable flex-item border border-info rounded bg-info-subtle m-1 px-2"
              onClick={() => {
                removeAttribute(attribute.full_name);
              }}
            >
              {attribute.name}
            </div>
          </Tooltip>
        ))}
        {restAttributes?.map((attribute) => (
          <Tooltip key={attribute.full_name} title="Add to important attributes">
            <div
              className="addable flex-item border border-secondary rounded bg-secondary-subtle m-1 px-2"
              onClick={() => {
                addAttribute(attribute.full_name);
              }}
            >
              {attribute.name}
            </div>
          </Tooltip>
        ))}
      </div>
    </>
  );
}

export default ImportantAttributesMenu;
