import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";

interface CandidateMenuProps {
  product: Product;
}

/**
 * This component renders menu of a candidate product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function CandidateMenu({ product }: CandidateMenuProps) {
  const { onDiscard } = useCategory();
  const navigate = useNavigate();
  const { step } = useParams();

  return (
    <>
      {step !== undefined && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={() => {
            navigate(generatePath(userStudyStepQuestionnairePattern, { step }));
          }}
        >
          My final choice
        </button>
      )}
      <Tooltip title="Discard">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            logEvent(Event.CANDIDATE_DISCARDED, { product_id: product.id });
            onDiscard(product.id);
          }}
        >
          <i className="bi bi-trash-fill" />
        </button>
      </Tooltip>
    </>
  );
}

export default CandidateMenu;
