import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";

interface RadioQuestionProps {
  options: string[];
  onChange: (response: string) => void;
}

/**
 * This component renders a radio question.
 *
 * @param {RadioQuestionProps} props
 * @param {string[]} props.options the options from which one can be selected
 * @param {(response: string) => void} props.onChange action to perform when response is changed
 * @constructor
 */
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
      className="mt-2 justify-content-center"
    >
      {options.map((label, index) => (
        <FormControlLabel
          key={index + 1}
          value={(index + 1).toString()}
          control={<Radio />}
          label={label}
          labelPlacement="top"
          className="me-1"
        />
      ))}
    </RadioGroup>
  );
}

export default RadioQuestion;
