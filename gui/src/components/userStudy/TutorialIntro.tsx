import Typography from "@mui/material/Typography";
import React from "react";

/**
 * This component renders a tutorial introduction for the whole user study.
 *
 * @constructor
 */
function TutorialIntro() {
  return (
    <div>
      <Typography variant="h3" className="mb-4">
        Explaining recommender systems in content-rich domains
      </Typography>
      <Typography variant="h4" className="mb-3">
        User study
      </Typography>
      <Typography variant="body1">
        The purpose of this system is to gather user data and evaluate two different interfaces that can be used in
        e-shops.
      </Typography>
    </div>
  );
}

export default TutorialIntro;
