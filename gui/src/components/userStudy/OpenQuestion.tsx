import React, { useState } from "react";
import { TextField } from "@mui/material";

interface OpenQuestionProps {
  onChange: (response: string) => void;
  label?: string;
}

/**
 * This component renders an open-end question.
 *
 * @param {OpenQuestionProps} props
 * @param {(response: string) => void} props.onChange action to perform when response is changed
 * @param {string} props.label label of the question, default is "Response"
 * @constructor
 */
function OpenQuestion({ onChange, label = "Response" }: OpenQuestionProps) {
  const [response, setResponse] = useState<string | null>("");

  return (
    <div className="d-flex justify-content-center align-items-center">
      <TextField
        multiline
        rows={3}
        className="w-50"
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

export default OpenQuestion;
