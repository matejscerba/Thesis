import { Attribute } from "../../types/attribute";
import Typography from "@mui/material/Typography";
import { valueToString } from "../../utils/attributes";
import React from "react";

interface AttributeOptionProps {
  option: any;
  attribute: Attribute;
  selected?: boolean;
}

/**
 * This component renders an option of an attribute.
 *
 * @param {AttributeOptionProps} props
 * @param {any} props.option the value of the option to render
 * @param {Attribute} props.attribute the attribute to which the option belongs
 * @param {boolean} props.selected specifies whether the option is selected and should thus be highlighted
 * @constructor
 */
function AttributeOption({ option, attribute, selected }: AttributeOptionProps) {
  const bgColor = selected ? "success" : "secondary";
  return (
    <div className={`flex-item border border-${bgColor} rounded text-bg-${bgColor} m-1 px-2`}>
      <Typography variant="body1">{valueToString(option, attribute)}</Typography>
    </div>
  );
}

export default AttributeOption;
