import React from "react";
import { getUITypeText } from "../types/config";
import { logEvent } from "../utils/api";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyOverallQuestionnairePattern, userStudyStepCategoryPattern } from "../routes";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";
import { useConfig } from "../contexts/config";

function StepQuestionnaire() {
  const navigate = useNavigate();
  const { step } = useParams();
  const { getUIType, getCategoryName } = useConfig();

  const currentUITypeText = getUITypeText(getUIType(step));

  const questions = [
    { title: "The final product was easy to find.", type: QuestionType.LIKERT },
    { title: "The system helped me decide when to stop searching for better products.", type: QuestionType.LIKERT },
    { title: `I found ${currentUITypeText} useful.`, type: QuestionType.LIKERT },
    {
      title: `I would like to see ${currentUITypeText} on production systems (other e-shops).`,
      type: QuestionType.LIKERT,
    },
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
            navigate(generatePath(userStudyStepCategoryPattern, { step: "2", name: getCategoryName("2") }));
          } else if (step === "2") {
            navigate(userStudyOverallQuestionnairePattern);
          }
        }}
      />
    </div>
  );
}

export default StepQuestionnaire;
