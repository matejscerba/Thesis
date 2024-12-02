import React, { useEffect, useState } from "react";
import { getUITypeText, UserStudySetupStep } from "../types/config";
import { fetchJson } from "../utils/api";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";
import { generatePath, Link } from "react-router-dom";
import { userStudyStepCategoryPattern } from "../routes";

function UserStudyIntro() {
  const [data, setData] = useState<UserStudySetupStep[]>(undefined);

  useEffect(() => {
    fetchJson<UserStudySetupStep[]>("user_study/steps")
      .then((steps) => {
        setData(steps);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <div className="mt-5">
      <Typography variant="h2" className="text-center mb-3">
        User study
      </Typography>
      {data ? (
        data.map((step) => (
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
        <p>Loading...</p> // TODO: Steps skeleton
      )}
      <div>
        <div className="step-item">
          <div className="border border-secondary rounded m-2 step-inner bg-white">
            <Typography variant="h5" className="step-category-name">
              Overall&nbsp;questionnaire
            </Typography>
          </div>
        </div>
      </div>
      {data && (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Link to={generatePath(userStudyStepCategoryPattern, { step: "1", name: data[0].category_name })}>
            <button type="button" className="btn btn-lg btn-primary mx-auto">
              Start
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserStudyIntro;
