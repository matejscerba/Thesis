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
      <Typography variant="body1">
        The application before you is a proposed improvement of interaction with recommender systems on eshops in
        content-rich domains. We would like to ask you to take a few minutes of your time to complete our user study to
        evaluate the solution.
      </Typography>
      <Typography variant="body1">
        You will be presented with two different product categories with different UI variant, where you will try to
        find the best product which you would like to buy (do not worry, we will not charge you anything). The UI is not
        equipped with search functionality, it is aimed at browsing the catalog with the help of a recommender system.
        You will be asked to fill 4 short questionnaires (total of 15 questions).
      </Typography>
    </div>
  );
}

export default TutorialIntro;
