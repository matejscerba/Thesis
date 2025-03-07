import React, { useState } from "react";
import RadioQuestion from "./RadioQuestion";
import OpenQuestion from "./OpenQuestion";

interface YesNoQuestionProps {
  onChange: (response: string, whyResponse: string | null | undefined) => void;
}

/**
 * This component renders a yes/no question. If the answer is "No", then a "Why?" open-end text field is rendered.
 *
 * @param {YesNoQuestionProps} props
 * @param {(response: string, whyResponse: string | null | undefined) => void} props.onChange action to perform when response is changed
 * @constructor
 */
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

export default YesNoQuestion;
