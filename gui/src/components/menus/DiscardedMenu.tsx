import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";

interface DiscardedMenuProps {
  product: Product;
}

/**
 * This component renders menu of a discarded product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function DiscardedMenu({ product }: DiscardedMenuProps) {
  const { onMarkCandidate } = useCategory();
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
      <Tooltip title="Put back to candidates">
        <button
          type="button"
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => {
            logEvent(Event.DISCARDED_ADDED_TO_CANDIDATES, { product_id: product.id });
            onMarkCandidate(product.id);
          }}
        >
          <i className="bi bi-heart-fill" />
        </button>
      </Tooltip>
    </>
  );
}

export default DiscardedMenu;
