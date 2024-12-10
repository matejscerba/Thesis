import React from "react";
import { useNavigate } from "react-router-dom";
import { indexPattern } from "../routes";
import { logEvent } from "../utils/api";
import { Event } from "../types/event";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";
import { QuestionType } from "../types/questionnaire";

function OverallQuestionnaire() {
  const navigate = useNavigate();

  const questions = [
    { title: "Scale question", type: QuestionType.SCALE },
    { title: "Open question", type: QuestionType.OPEN },
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
