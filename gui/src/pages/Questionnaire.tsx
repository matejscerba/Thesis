import React, { useEffect, useState } from "react";
import { UserStudySetupStep } from "../types/config";
import { fetchJson, logEvent } from "../utils/api";
import Typography from "@mui/material/Typography";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyQuestionnairePattern, userStudyStepCategoryPattern } from "../routes";
import { Event } from "../types/event";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

enum QuestionType {
  SCALE = "SCALE",
  OPEN = "OPEN",
}

interface Question {
  title: string;
  type: QuestionType;
}

interface QuestionProps {
  question: Question;
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

function Questionnaire() {
  const navigate = useNavigate();
  const { step } = useParams();
  const [data, setData] = useState<UserStudySetupStep[]>(undefined);

  useEffect(() => {
    fetchJson<UserStudySetupStep[]>("user_study/steps")
      .then((steps) => {
        setData(steps);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const questions = [
    { title: "Scale question", type: QuestionType.SCALE },
    { title: "Open question", type: QuestionType.OPEN },
  ];

  const [responses, setResponses] = useState<(string | null)[]>(questions.map(() => null));

  return (
    <div className="mt-5">
      <Typography variant="h2" className="text-center">
        Questionnaire
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
        {step === "1" && data && (
          <button
            type="button"
            className="btn btn-lg btn-primary mx-auto"
            onClick={() => {
              logEvent(Event.QUESTIONNAIRE_SUBMITTED, {
                step,
                data: questions.map((question, index) => ({ ...question, response: responses[index] })),
              });
              navigate(generatePath(userStudyStepCategoryPattern, { step: "2", name: data[1].category_name }));
            }}
          >
            Submit and go to next category
          </button>
        )}
        {step === "2" && (
          <button
            type="button"
            className="btn btn-lg btn-primary mx-auto"
            onClick={() => {
              logEvent(Event.QUESTIONNAIRE_SUBMITTED, {
                step,
                data: questions.map((question, index) => ({ ...question, response: responses[index] })),
              });
              navigate(userStudyQuestionnairePattern);
            }}
          >
            Submit and go to overall questionnaire
          </button>
        )}
      </div>
    </div>
  );
}

export default Questionnaire;
