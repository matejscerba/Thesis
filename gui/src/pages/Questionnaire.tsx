import React, { useEffect, useState } from "react";
import { UserStudySetupStep } from "../types/config";
import { fetchJson, logEvent } from "../utils/api";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyQuestionnairePattern, userStudyStepCategoryPattern } from "../routes";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";

function Questionnaire() {
  const navigate = useNavigate();
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

  const questions = [
    { title: "Scale question", type: QuestionType.SCALE },
    { title: "Open question", type: QuestionType.OPEN },
  ];

  return (
    <div className="mt-5">
      <QuestionnaireBody
        title="Questionnaire"
        questions={questions}
        submitButtonTitle={
          step === "1"
            ? "Submit and go to next category"
            : step === "2"
              ? "Submit and go to overall questionnaire"
              : "Submit"
        }
        onSubmit={(questionnaireData) => {
          logEvent(Event.STEP_QUESTIONNAIRE_SUBMITTED, {
            step,
            data: questionnaireData,
          });
          if (step === "1") {
            navigate(generatePath(userStudyStepCategoryPattern, { step: "2", name: data[1].category_name }));
          } else if (step === "2") {
            navigate(userStudyQuestionnairePattern);
          }
        }}
      />
    </div>
  );
}

export default Questionnaire;
