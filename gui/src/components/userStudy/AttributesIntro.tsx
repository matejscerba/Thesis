import React from "react";
import Typography from "@mui/material/Typography";

/**
 * This component renders a tutorial introduction for attributes.
 *
 * @constructor
 */
function AttributesIntro() {
  return (
    <div>
      <Typography variant="h3">Important attributes</Typography>
      <Typography variant="body1">
        You can select important attributes using a menu in the left part of the screen. All of the important attributes
        and their values are displayed in each product's box. Only these attributes are considered by the system and the
        rest is ignored.
      </Typography>
      <img src="/media/images/attributes_menu.png" alt="Important attributes menu" />
    </div>
  );
}

export default AttributesIntro;
