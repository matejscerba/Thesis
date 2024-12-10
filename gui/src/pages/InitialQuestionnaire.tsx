import React from "react";
import { logEvent } from "../utils/api";
import { generatePath, useNavigate } from "react-router-dom";
import { userStudyStepCategoryPattern } from "../routes";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";
import { useConfig } from "../contexts/config";

function InitialQuestionnaire() {
  const navigate = useNavigate();
  const { getCategoryName } = useConfig();

  const questions = [
    { title: "How old are you?", type: QuestionType.OPEN },
    { title: "What is your gender?", type: QuestionType.GENDER },
    { title: "What is your current occupation?", type: QuestionType.OPEN },
  ];

  return (
    <div className="mt-5">
      <QuestionnaireBody
        title="Initial questionnaire"
        questions={questions}
        submitButtonTitle="Submit and go to first category"
        onSubmit={(questionnaireData) => {
          logEvent(Event.INITIAL_QUESTIONNAIRE_SUBMITTED, {
            data: questionnaireData,
          });
          navigate(generatePath(userStudyStepCategoryPattern, { step: "1", name: getCategoryName("1") }));
        }}
      />
    </div>
  );
}

export default InitialQuestionnaire;
