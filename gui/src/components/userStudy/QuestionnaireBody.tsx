import { Question as QuestionInterface, Response, QuestionWithResponse } from "../../types/questionnaire";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Question from "./Question";

interface QuestionnaireBodyProps {
  title: string;
  questions: QuestionInterface[];
  submitButtonTitle: string;
  onSubmit: (data: QuestionWithResponse[]) => void;
}

function QuestionnaireBody({ title, questions, submitButtonTitle, onSubmit }: QuestionnaireBodyProps) {
  const [responses, setResponses] = useState<(Response | null)[]>(questions.map(() => null));

  return (
    <>
      <Typography variant="h2" className="text-center">
        {title}
      </Typography>
      {questions.map((question, index) => (
        <div key={question.title} className="my-3 rounded border border-secondary">
          <Question
            question={question}
            onChange={(response) => {
              setResponses((prevState) => [...prevState.slice(0, index), response, ...prevState.slice(index + 1)]);
            }}
          />
        </div>
      ))}
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          type="button"
          className="btn btn-lg btn-primary mx-auto"
          onClick={() => {
            onSubmit(
              questions.map((question, index) => ({
                ...question,
                response: responses[index]?.response,
                why_response: responses[index]?.whyResponse,
              })),
            );
          }}
        >
          {submitButtonTitle}
        </button>
      </div>
    </>
  );
}

export default QuestionnaireBody;
