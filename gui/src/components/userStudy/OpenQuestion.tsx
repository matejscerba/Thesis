import React, { useState } from "react";
import { TextField } from "@mui/material";

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

export default OpenQuestion;
