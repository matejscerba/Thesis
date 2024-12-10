import React from "react";
import { getUITypeText, UserStudySetupStep } from "../../types/config";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../../utils/tools";
import { Skeleton } from "@mui/material";

interface UserStudyStepsProps {
  steps: UserStudySetupStep[] | undefined;
}

function UserStudySteps({ steps }: UserStudyStepsProps) {
  return (
    <>
      <Typography variant="h2" className="text-center mb-3">
        Steps
      </Typography>
      {steps ? (
        steps.map((step) => (
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
                <Typography variant="h5" className="step-category-name">
                  {capitalizeFirstLetter(step.category_name).replace(/ /g, "\u00a0")}&nbsp;with&nbsp;
                  {getUITypeText(step.ui_type).replace(/ /g, "\u00a0")}
                  <br />
                  <span className="small">Product&nbsp;selection&nbsp;and&nbsp;questionnaire</span>
                </Typography>
              </div>
            </div>
            <div>
              <Typography variant="h3" className="text-center">
                <i className="bi bi-arrow-down-short" />
              </Typography>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="step-item">
            <Skeleton className="step-inner" sx={{ width: "30%", height: "150px" }} />
          </div>
          <div>
            <Typography variant="h3" className="text-center">
              <i className="bi bi-arrow-down-short" />
            </Typography>
          </div>
          <div className="step-item">
            <Skeleton className="step-inner" sx={{ width: "30%", height: "150px" }} />
          </div>
          <div>
            <Typography variant="h3" className="text-center">
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
