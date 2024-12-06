import React from "react";
import { StoppingCriteriaTitle } from "../stoppingCriteria/StoppingCriteria";
import { useConfig } from "../../contexts/config";
import { useParams } from "react-router-dom";
import { UIType } from "../../types/config";
import { UnseenTitle } from "./Unseen";

function StoppingCriteriaTitleWrapper() {
  const { getUIType } = useConfig();
  const { step } = useParams();

  const uiType = getUIType(step);

  switch (uiType) {
    case UIType.STOPPING_CRITERIA:
      return <StoppingCriteriaTitle />;
    case UIType.UNSEEN_STATISTICS:
      return <UnseenTitle />;
  }
}

export default StoppingCriteriaTitleWrapper;
