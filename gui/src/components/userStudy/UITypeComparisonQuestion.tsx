import RadioQuestion from "./RadioQuestion";
import Typography from "@mui/material/Typography";
import React from "react";
import { getUITypeImageFilename, getUITypeText } from "../../utils/config";
import { capitalizeFirstLetter } from "../../utils/tools";
import { useConfig } from "../../contexts/config";

interface UITypeComparisonQuestionProps {
  onChange: (response: string) => void;
}

/**
 * This component renders a UI type comparison question.
 *
 * @param {UITypeComparisonQuestionProps} props
 * @param {(response: string) => void} props.onChange action to perform when response is changed
 * @constructor
 */
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
        <div className="ui-type-comparison-item">
          <Typography variant="body1" className="text-center">
            {firstUITypeTextCapitalized}
          </Typography>
          <img src={`/media/images/${firstUITypeImageFilename}`} alt={firstUITypeText} />
        </div>
        <div className="ui-type-comparison-item">
          <Typography variant="body1" className="text-center">
            {secondUITypeTextCapitalized}
          </Typography>
          <img src={`/media/images/${secondUITypeImageFilename}`} alt={secondUITypeText} />
        </div>
      </div>
    </>
  );
}

export default UITypeComparisonQuestion;
