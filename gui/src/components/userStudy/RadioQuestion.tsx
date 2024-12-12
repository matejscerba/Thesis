import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";

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
    </RadioGroup>
  );
}

export default RadioQuestion;
