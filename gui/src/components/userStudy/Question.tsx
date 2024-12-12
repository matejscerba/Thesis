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
      {question.type === QuestionType.GENDER && (
        <RadioQuestion
          options={genderResponses}
          onChange={(response) => {
            onChange({ response });
          }}
        />
      )}
    </div>
  );
}

export default Question;
