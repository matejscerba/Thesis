import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";

interface AlternativeMenuProps {
  product: Product;
}

/**
 * This component renders menu of an alternative product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function AlternativeMenu({ product }: AlternativeMenuProps) {
  const { onDiscard, onMarkCandidate } = useCategory();
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
      <Tooltip title="Move to candidates">
        <button
          type="button"
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => {
            logEvent(Event.ALTERNATIVE_ADDED_TO_CANDIDATES, { product_id: product.id });
            onMarkCandidate(product.id);
          }}
        >
          <i className="bi bi-heart-fill" />
        </button>
      </Tooltip>
      <Tooltip title="Discard">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            logEvent(Event.ALTERNATIVE_DISCARDED, { product_id: product.id });
            onDiscard(product.id);
          }}
        >
          <i className="bi bi-trash-fill" />
        </button>
      </Tooltip>
    </>
  );
}

export default AlternativeMenu;
