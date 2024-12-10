import React from "react";
import { useAttributes } from "../../contexts/attributes";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";

/**
 * This component renders the menu that can mark attributes as important.
 *
 * @constructor
 */
function ImportantAttributesMenu() {
  const { groups, attributes, restAttributes, addAttribute, removeAttribute } = useAttributes();

  return (
    <>
      <Typography variant="h5">Important attributes</Typography>
      {groups?.map((group) => (
        <div key={group}>
          <hr className="my-1" />
          <Typography variant="body1">{group}</Typography>
          <div className="flex-wrapper important-attributes-menu">
            {attributes
              ?.filter((attribute) => attribute.group === group)
              .sort()
              .map((attribute) => (
                <Tooltip key={attribute.full_name} title="Remove from important attributes">
                  <div
                    className="removable flex-item border border-info rounded bg-info-subtle m-1 px-2"
                    onClick={() => {
                      logEvent(Event.ATTRIBUTE_REMOVED_FROM_IMPORTANT, { attribute: attribute.full_name });
                      removeAttribute(attribute.full_name);
                    }}
                  >
                    {attribute.name}
                  </div>
                </Tooltip>
              ))}
            {restAttributes
              ?.filter((attribute) => attribute.group === group)
              .sort()
              .map((attribute) => (
                <Tooltip key={attribute.full_name} title="Add to important attributes">
                  <div
                    className="addable flex-item border border-secondary rounded bg-secondary-subtle m-1 px-2"
                    onClick={() => {
                      logEvent(Event.ATTRIBUTE_ADDED_TO_IMPORTANT, { attribute: attribute.full_name });
                      addAttribute(attribute.full_name);
                    }}
                  >
                    {attribute.name}
                  </div>
                </Tooltip>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default ImportantAttributesMenu;
