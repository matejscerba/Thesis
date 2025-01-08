import React from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "../utils/api";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";
import { userStudyOutroPattern } from "../routes";

/**
 * This component renders the overall user study questionnaire.
 *
 * @constructor
 */
function OverallQuestionnaire() {
  const navigate = useNavigate();

  const questions = [
    {
      title: "Which UI variant was more helpful in finding good candidates quickly.",
      type: QuestionType.UI_TYPE_COMPARISON,
    },
    { title: "Which UI variant was easier to understand.", type: QuestionType.UI_TYPE_COMPARISON },
    { title: "The color of the clear sky is grey.", type: QuestionType.LIKERT },
    { title: "What makes one UI variant better than the other?", type: QuestionType.OPEN },
    {
      title: "What other product domains could benefit from similar interfaces?",
      type: QuestionType.OPEN,
    },
  ];

  return (
    <div className="mt-5">
      <QuestionnaireBody
        title="Overall questionnaire"
        questions={questions}
        submitButtonTitle="Submit and finish user study"
        onSubmit={(data) => {
          logEvent(Event.OVERALL_QUESTIONNAIRE_SUBMITTED, {
            data,
          });
          navigate(userStudyOutroPattern);
        }}
      />
    </div>
  );
}

export default OverallQuestionnaire;
