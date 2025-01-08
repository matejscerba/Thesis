import React from "react";
import Typography from "@mui/material/Typography";

/**
 * This component renders a tutorial introduction for the user's goal during the user study.
 *
 * @constructor
 */
function GoalIntro() {
  return (
    <div>
      <Typography variant="h3">Tutorial - Your goal</Typography>
      <Typography variant="body1">
        Your goal is to select a product you would like to buy by{" "}
        <strong>
          clicking the{" "}
          <button type="button" className="btn btn-sm btn-outline-secondary">
            My final choice
          </button>{" "}
          button
        </strong>
        .
      </Typography>
      <Typography variant="body1">
        Imagine you want to buy a new product. You want to buy the best product possible for you, the criteria is up to
        you.
      </Typography>
      <ul>
        <li>Start by selecting Important attributes in the left menu.</li>
        <li>Select good products as candidates as you browse the catalog.</li>
        <li>Discard bad products as candidates as you browse the catalog.</li>
        <li>
          After you feel like there is no good products for you, select the best products from candidates by clicking
          the{" "}
          <button type="button" className="btn btn-sm btn-outline-secondary">
            My final choice
          </button>{" "}
          button.
        </li>
      </ul>
      <Typography variant="body1">
        Be reasonably sure that there is no better product when clicking the{" "}
        <button type="button" className="btn btn-sm btn-outline-secondary">
          My final choice
        </button>{" "}
        button.
      </Typography>
      <Typography variant="body1">Answer all questionnaires truthfully, please.</Typography>
    </div>
  );
}

export default GoalIntro;
