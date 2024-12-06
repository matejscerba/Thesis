import React from "react";
import StoppingCriteria from "../stoppingCriteria/StoppingCriteria";
import { useConfig } from "../../contexts/config";
import { useParams } from "react-router-dom";
import { UIType } from "../../types/config";
import Unseen from "./Unseen";

function StoppingCriteriaWrapper() {
  const { getUIType } = useConfig();
  const { step } = useParams();

  const uiType = getUIType(step);

  switch (uiType) {
    case UIType.STOPPING_CRITERIA:
      return <StoppingCriteria />;
    case UIType.UNSEEN_STATISTICS:
      return <Unseen />;
  }
}

export default StoppingCriteriaWrapper;
