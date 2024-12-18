import { Question as QuestionInterface, QuestionType, Response } from "../../types/questionnaire";
import Typography from "@mui/material/Typography";
import React from "react";
import RadioQuestion from "./RadioQuestion";
import OpenQuestion from "./OpenQuestion";
import YesNoQuestion from "./YesNoQuestion";
import UITypeComparisonQuestion from "./UITypeComparisonQuestion";

interface QuestionProps {
  question: QuestionInterface;
  onChange: (response: Response) => void;
}

/**
 * This component renders a question.
 *
 * @param {QuestionProps} props
 * @param {QuestionInterface} props.question the question to be rendered
 * @param {(response: Response) => void} props.onChange action to perform when response is changed
 * @constructor
 */
function Question({ question, onChange }: QuestionProps) {
  const likertResponses = [
    "Strongly Disagree",
    "Disagree",
    "Partially Disagree",
    "Neutral",
    "Partially Agree",
    "Agree",
    "Strongly Agree",
  ];

  const genderResponses = ["Male", "Female", "Other"];

  const ageResponses = ["0-20", "21-30", "31-40", "41-50", "51-60", "60+"];

  const lastTimeResponses = [
    "Several days ago",
    "Several weeks ago",
    "Several months ago",
    "Several years ago",
    "Never",
  ];

  return (
    <div className="my-3">
      <Typography variant="h4" className="text-center">
        {question.title}
      </Typography>
      {question.type === QuestionType.LIKERT && (
        <RadioQuestion
          options={likertResponses}
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
      {question.type === QuestionType.UI_TYPE_COMPARISON && (
        <UITypeComparisonQuestion
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
      {question.type === QuestionType.YES_NO && (
        <YesNoQuestion
          onChange={(response, whyResponse) => {
            onChange({ response, whyResponse });
          }}
        />
      )}
      {question.type === QuestionType.OPEN && (
        <OpenQuestion
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
      {question.type === QuestionType.AGE && (
        <RadioQuestion
          options={ageResponses}
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
      {question.type === QuestionType.GENDER && (
        <RadioQuestion
          options={genderResponses}
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
      {question.type === QuestionType.LAST_TIME && (
        <RadioQuestion
          options={lastTimeResponses}
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
    </div>
  );
}

export default Question;
