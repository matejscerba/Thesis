import { Question as QuestionInterface, QuestionType, QuestionWithResponse } from "../../types/questionnaire";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

interface QuestionProps {
  question: QuestionInterface;
  onChange: (response: string) => void;
}
function Question({ question, onChange }: QuestionProps) {
  const [response, setResponse] = useState<string | null>(null);

  const scaleResponses = [
    "Strongly Disagree",
    "Disagree",
    "Partially Disagree",
    "Neutral",
    "Partially Agree",
    "Agree",
    "Strongly Agree",
  ];

  return (
    <div className="mt-3">
      <Typography variant="h4" className="text-center">
        {question.title}
      </Typography>
      {question.type === QuestionType.SCALE && (
        <RadioGroup
          row
          value={response}
          onChange={(event) => {
            onChange(event.target.value);
            setResponse(event.target.value);
          }}
          sx={{ justifyContent: "center" }}
        >
          {scaleResponses.map((label, index) => (
            <FormControlLabel
              key={index + 1}
              value={(index + 1).toString()}
              control={<Radio />}
              label={label}
              labelPlacement="top"
              sx={{ margin: "0 8px" }}
            />
          ))}
        </RadioGroup>
      )}
      {question.type === QuestionType.OPEN && (
        <div className="d-flex justify-content-center align-items-center">
          <TextField
            multiline
            rows={3}
            sx={{ width: "50%" }}
            label="Response"
            value={response}
            onChange={(event) => {
              onChange(event.target.value);
              setResponse(event.target.value);
            }}
            margin="normal"
          />
        </div>
      )}
    </div>
  );
}

interface QuestionnaireBodyProps {
  title: string;
  questions: QuestionInterface[];
  submitButtonTitle: string;
  onSubmit: (data: QuestionWithResponse[]) => void;
}

function QuestionnaireBody({ title, questions, submitButtonTitle, onSubmit }: QuestionnaireBodyProps) {
  const [responses, setResponses] = useState<(string | null)[]>(questions.map(() => null));

  return (
    <>
      <Typography variant="h2" className="text-center">
        {title}
      </Typography>
      {questions.map((question, index) => (
        <Question
          key={question.title}
          question={question}
          onChange={(response) => {
            setResponses((prevState) => [...prevState.slice(0, index), response, ...prevState.slice(index + 1)]);
          }}
        />
      ))}
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          type="button"
          className="btn btn-lg btn-primary mx-auto"
          onClick={() => {
            onSubmit(questions.map((question, index) => ({ ...question, response: responses[index] })));
          }}
        >
          {submitButtonTitle}
        </button>
      </div>
    </>
  );
}

export default QuestionnaireBody;
