import { Question as QuestionInterface, QuestionType, Response, QuestionWithResponse } from "../../types/questionnaire";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useConfig } from "../../contexts/config";
import { getUITypeImageFilename, getUITypeText } from "../../types/config";
import { capitalizeFirstLetter } from "../../utils/tools";

interface RadioGroupItemsProps {
  options: string[];
}

function RadioGroupItems({ options }: RadioGroupItemsProps) {
  return (
    <>
      {options.map((label, index) => (
        <FormControlLabel
          key={index + 1}
          value={(index + 1).toString()}
          control={<Radio />}
          label={label}
          labelPlacement="top"
          sx={{ margin: "0 8px" }}
        />
      ))}
    </>
  );
}

interface RadioQuestionProps {
  options: string[];
  onChange: (response: string) => void;
}

function RadioQuestion({ options, onChange }: RadioQuestionProps) {
  const [response, setResponse] = useState<string | null>(null);

  return (
    <RadioGroup
      row
      value={response}
      onChange={(event) => {
        setResponse(event.target.value);
        onChange(options[Number.parseInt(event.target.value) - 1]);
      }}
      sx={{ justifyContent: "center", mt: "16px" }}
    >
      <RadioGroupItems options={options} />
    </RadioGroup>
  );
}

interface OpenQuestionProps {
  onChange: (response: string) => void;
  label?: string;
}

function OpenQuestion({ onChange, label = "Response" }: OpenQuestionProps) {
  const [response, setResponse] = useState<string | null>("");

  return (
    <div className="d-flex justify-content-center align-items-center">
      <TextField
        multiline
        rows={3}
        sx={{ width: "50%" }}
        label={label}
        value={response}
        onChange={(event) => {
          onChange(event.target.value);
          setResponse(event.target.value);
        }}
        margin="normal"
      />
    </div>
  );
}

interface YesNoQuestionProps {
  onChange: (response: string, whyResponse: string | null | undefined) => void;
}

function YesNoQuestion({ onChange }: YesNoQuestionProps) {
  const yesNoResponses = ["Yes", "No"];

  const [response, setResponse] = useState<string | null>(null);
  const [whyResponse, setWhyResponse] = useState<string | null>("");

  return (
    <>
      <RadioQuestion
        options={yesNoResponses}
        onChange={(radioResponse) => {
          setResponse(radioResponse);
          onChange(radioResponse, radioResponse === yesNoResponses[1] ? whyResponse : undefined);
        }}
      />
      {response === yesNoResponses[1] && (
        <OpenQuestion
          onChange={(openResponse) => {
            setWhyResponse(openResponse);
            onChange(response, response === yesNoResponses[1] ? openResponse : undefined);
          }}
          label="Why?"
        />
      )}
    </>
  );
}

interface QuestionProps {
  question: QuestionInterface;
  onChange: (response: Response) => void;
}

function Question({ question, onChange }: QuestionProps) {
  const { getUIType } = useConfig();

  const likertResponses = [
    "Strongly Disagree",
    "Disagree",
    "Partially Disagree",
    "Neutral",
    "Partially Agree",
    "Agree",
    "Strongly Agree",
  ];

  const firstUITypeText = getUITypeText(getUIType("1"));
  const firstUITypeTextCapitalized = capitalizeFirstLetter(firstUITypeText);
  const firstUITypeImageFilename = getUITypeImageFilename(getUIType("1"));
  const secondUITypeText = getUITypeText(getUIType("2"));
  const secondUITypeTextCapitalized = capitalizeFirstLetter(secondUITypeText);
  const secondUITypeImageFilename = getUITypeImageFilename(getUIType("2"));

  const uiTypeComparisonResponses = [
    `Definitely ${firstUITypeText}`,
    firstUITypeTextCapitalized,
    `Rather ${firstUITypeText}`,
    "Both were equal",
    `Rather ${secondUITypeText}`,
    secondUITypeTextCapitalized,
    `Definitely ${secondUITypeText}`,
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
        <>
          <RadioQuestion
            options={uiTypeComparisonResponses}
            onChange={(response) => {
              onChange({ response });
            }}
          />
          <div className="d-flex justify-content-between align-items-center px-4 py-2">
            <div style={{ maxWidth: "40%" }}>
              <Typography variant="body1" className="text-center">
                {firstUITypeTextCapitalized}
              </Typography>
              <img
                style={{ maxWidth: "100%" }}
                src={`/media/images/${firstUITypeImageFilename}`}
                alt={firstUITypeText}
              />
            </div>
            <div style={{ maxWidth: "40%" }}>
              <Typography variant="body1" className="text-center">
                {secondUITypeTextCapitalized}
              </Typography>
              <img
                style={{ maxWidth: "100%" }}
                src={`/media/images/${secondUITypeImageFilename}`}
                alt={secondUITypeText}
              />
            </div>
          </div>
        </>
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
