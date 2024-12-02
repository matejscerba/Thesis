import React, { useEffect, useState } from "react";
import { UserStudySetupStep } from "../types/config";
import { fetchJson } from "../utils/api";
import Typography from "@mui/material/Typography";
import { generatePath, Link, useParams } from "react-router-dom";
import { userStudyQuestionnairePattern, userStudyStepCategoryPattern } from "../routes";

function Questionnaire() {
  const { step } = useParams();
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
      <Typography variant="h2" className="text-center">
        Questionnaire
      </Typography>
      <div className="d-flex justify-content-center align-items-center mt-5">
        {step === "1" && data && (
          <Link to={generatePath(userStudyStepCategoryPattern, { step: "2", name: data[1].category_name })}>
            <button type="button" className="btn btn-lg btn-primary mx-auto">
              Next category
            </button>
          </Link>
        )}
        {step === "2" && (
          <Link to={userStudyQuestionnairePattern}>
            <button type="button" className="btn btn-lg btn-primary mx-auto">
              Overall questionnaire
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Questionnaire;
