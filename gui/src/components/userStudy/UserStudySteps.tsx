import React from "react";
import { getUITypeText } from "../../utils/config";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../../utils/tools";
import { Skeleton } from "@mui/material";
import { useConfig } from "../../contexts/config";

/**
 * This component renders the steps of the user study.
 *
 * @constructor
 */
function UserStudySteps() {
  const { userStudySteps } = useConfig();

  return (
    <>
      <Typography variant="h3">Tutorial - Steps</Typography>
      <div className="step-item">
        <div className="border border-secondary rounded m-2 step-inner bg-white">
          <Typography variant="h5" className="step-category-name">
            Initial&nbsp;questionnaire
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="h3">
          <i className="bi bi-arrow-down-short" />
        </Typography>
      </div>
      {userStudySteps ? (
        userStudySteps.map((step) => (
          <div key={step.category_name}>
            <div className="step-item">
              <div className="border border-secondary rounded m-2 px-3 step-inner bg-white">
                <div className="step-image-wrapper">
                  <img
                    alt={step.category_name}
                    src={`/media/products/${step.category_name}/1.jpg`}
                    className="step-image"
                  />
                </div>
                <div className="step-category-name">
                  <Typography variant="h5">
                    {capitalizeFirstLetter(step.category_name).replace(/ /g, "\u00a0")}&nbsp;with&nbsp;
                    {getUITypeText(step.ui_type).replace(/ /g, "\u00a0")}
                  </Typography>
                  <Typography variant="body1" className="mt-0">
                    Select the best product for you and fill out a short questionnaire
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <Typography variant="h3">
                <i className="bi bi-arrow-down-short" />
              </Typography>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="step-item">
            <Skeleton className="step-inner step-inner-skeleton" />
          </div>
          <div>
            <Typography variant="h3">
              <i className="bi bi-arrow-down-short" />
            </Typography>
          </div>
          <div className="step-item">
            <Skeleton className="step-inner step-inner-skeleton" />
          </div>
          <div>
            <Typography variant="h3">
              <i className="bi bi-arrow-down-short" />
            </Typography>
          </div>
        </div>
      )}
      <div className="step-item">
        <div className="border border-secondary rounded m-2 step-inner bg-white">
          <Typography variant="h5" className="step-category-name">
            Overall&nbsp;questionnaire
          </Typography>
        </div>
      </div>
    </>
  );
}

export default UserStudySteps;
