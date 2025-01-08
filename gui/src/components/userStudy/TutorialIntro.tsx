import Typography from "@mui/material/Typography";
import React from "react";
import { Divider } from "@mui/material";

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
        You will be asked to fill 4 short questionnaires.
      </Typography>
      <Divider />
      <Typography variant="body1">
        Before continuing with the research, you should be familiarize yourself and agree with the following statements:
      </Typography>
      <ul>
        <li>
          I familiarize myself with the aim and targets of the research project and I do not mind to contribute on it
          (i.e., the research topic does not go against my beliefs etc.)
        </li>
        <li>
          I agree that authors of the project may utilize my (anonymous) responses and my demographic data while
          presenting research outcomes - e.g. in scientific papers.
        </li>
        <ul>
          <li>We will never publish data that could breach your identity (we do not have such data anyway).</li>
          <li>
            In the prospective paper, we would like to publish an anonymized dataset of responses. The dataset should
            contain following information:
          </li>
          <ul>
            <li>randomly generated ID of the participant (i.e. ID = kkp4ZmNyUtdFBf4FnDt83uqsBmVpgbV-jdbMTvY7FAk)</li>
            <li>demographic data of the participant (gender, age group, occupation)</li>
            <li>participant's responses to questions</li>
            <li>
              In the dataset, there will be no mapping between the ID of the user and his/her true identity (we do not
              have such data anyway).
            </li>
          </ul>
        </ul>
        <li>You can stop your participation at any time (just close the browser window).</li>
        <li>
          PS: any disputes (hopefully, none should arise) will be governed by the law and jurisdiction of Czech
          Republic.
        </li>
      </ul>
    </div>
  );
}

export default TutorialIntro;
