import React from "react";
import { useNavigate } from "react-router-dom";
import { indexPattern } from "../routes";
import { logEvent } from "../utils/api";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";

/**
 * This component renders the overall user study questionnaire.
 *
 * @constructor
 */
function OverallQuestionnaire() {
  const navigate = useNavigate();

  const questions = [
    { title: "Which UI variant was more helpful in finding more candidates.", type: QuestionType.UI_TYPE_COMPARISON },
    { title: "Which UI variant was easier to understand.", type: QuestionType.UI_TYPE_COMPARISON },
    { title: "In your opinion, what makes one UI variant better than the other?", type: QuestionType.OPEN },
    { title: "Working with the system was smooth and intuitive.", type: QuestionType.YES_NO },
    {
      title: "In your opinion, what other product domains could benefit from similar interfaces?",
      type: QuestionType.OPEN,
    },
  ];

  return (
    <div className="mt-5">
      <QuestionnaireBody
        title="Overall questionnaire"
        questions={questions}
        submitButtonTitle="Submit and go to home page"
        onSubmit={(data) => {
          logEvent(Event.OVERALL_QUESTIONNAIRE_SUBMITTED, {
            data,
          });
          navigate(indexPattern);
        }}
      />
    </div>
  );
}

export default OverallQuestionnaire;
