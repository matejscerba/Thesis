import React from "react";
import { logEvent } from "../utils/api";
import { generatePath, useNavigate } from "react-router-dom";
import { userStudyStepCategoryPattern } from "../routes";
import { Event } from "../types/event";
import { QuestionType } from "../types/questionnaire";
import QuestionnaireBody from "../components/userStudy/QuestionnaireBody";
import { useConfig } from "../contexts/config";

/**
 * This component renders the initial user study questionnaire.
 *
 * @constructor
 */
function InitialQuestionnaire() {
  const navigate = useNavigate();
  const { getCategoryName } = useConfig();

  const firstCategoryName = getCategoryName("1").replace("-", " ");
  const firstCategoryItemName = firstCategoryName.endsWith("s")
    ? firstCategoryName.slice(0, firstCategoryName.length - 1)
    : firstCategoryName;
  const secondCategoryName = getCategoryName("2").replace("-", " ");
  const secondCategoryItemName = secondCategoryName.endsWith("s")
    ? secondCategoryName.slice(0, secondCategoryName.length - 1)
    : secondCategoryName;

  const questions = [
    { title: "My age:", type: QuestionType.AGE },
    { title: "My gender:", type: QuestionType.GENDER },
    { title: "My occupation:", type: QuestionType.OPEN },
    {
      title: `I am familiar with the domain of ${firstCategoryName}.`,
      type: QuestionType.LIKERT,
    },
    {
      title: `Last time I bought a ${firstCategoryItemName} was:`,
      type: QuestionType.LAST_TIME,
    },
    {
      title: `I am familiar with the domain of ${secondCategoryName}.`,
      type: QuestionType.LIKERT,
    },
    {
      title: `Last time I bought a ${secondCategoryItemName} was:`,
      type: QuestionType.LAST_TIME,
    },
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
