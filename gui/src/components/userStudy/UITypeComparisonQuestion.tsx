import RadioQuestion from "./RadioQuestion";
import Typography from "@mui/material/Typography";
import React from "react";
import { getUITypeImageFilename, getUITypeText } from "../../types/config";
import { capitalizeFirstLetter } from "../../utils/tools";
import { useConfig } from "../../contexts/config";

interface UITypeComparisonQuestionProps {
  onChange: (response: string) => void;
}

function UITypeComparisonQuestion({ onChange }: UITypeComparisonQuestionProps) {
  const { getUIType } = useConfig();

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

  return (
    <>
      <RadioQuestion options={uiTypeComparisonResponses} onChange={onChange} />
      <div className="d-flex justify-content-between align-items-center px-4 py-2">
        <div style={{ maxWidth: "40%" }}>
          <Typography variant="body1" className="text-center">
            {firstUITypeTextCapitalized}
          </Typography>
          <img style={{ maxWidth: "100%" }} src={`/media/images/${firstUITypeImageFilename}`} alt={firstUITypeText} />
        </div>
        <div style={{ maxWidth: "40%" }}>
          <Typography variant="body1" className="text-center">
            {secondUITypeTextCapitalized}
          </Typography>
          <img style={{ maxWidth: "100%" }} src={`/media/images/${secondUITypeImageFilename}`} alt={secondUITypeText} />
        </div>
      </div>
    </>
  );
}

export default UITypeComparisonQuestion;
