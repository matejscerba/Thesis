import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";
import React from "react";
import { Tooltip } from "@mui/material";

interface ButtonProps {
  productId: number;
  event: Event;
  data?: { [key: string]: any };
  isActive?: boolean;
}

/**
 * This component renders a button that handles selecting a product as a final choice.
 *
 * @param {ButtonProps} props
 * @param {number} props.productId the ID of the product for which to render this button
 * @param {Event} props.event the event that is triggered when this button is clicked
 * @param {{ [key: string]: any }} props.data the data of the event
 * @constructor
 */
export function FinalChoiceSelectedButton({ productId, event, data }: ButtonProps) {
  const { step } = useParams();
  const navigate = useNavigate();

  return (
    step !== undefined && (
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary me-2"
        onClick={() => {
          logEvent(event, { product_id: productId });
          navigate(generatePath(userStudyStepQuestionnairePattern, { step, ...(data ?? {}) }));
        }}
      >
        My final choice
      </button>
    )
  );
}

interface MoveToCandidatesButtonProps extends ButtonProps {
  onMarkCandidate: (productId: number) => void;
}

/**
 * This component renders a button that handles moving a product to candidates.
 *
 * @param {ButtonProps} props
 * @param {number} props.productId the ID of the product for which to render this button
 * @param {Event} props.event the event that is triggered when this button is clicked
 * @param {{ [key: string]: any }} props.data the data of the event
 * @param {(productId: number) => void} props.onMarkCandidate the action to perform when this button is clicked
 * @param {boolean} props.isActive whether the button is active (clicked)
 * @constructor
 */
export function MoveToCandidatesButton({
  productId,
  event,
  data,
  onMarkCandidate,
  isActive,
}: MoveToCandidatesButtonProps) {
  return (
    <Tooltip title="Move to candidates">
      <button
        type="button"
        className={`btn btn-sm ${isActive ? "btn-success" : "btn-outline-success"} me-2`}
        onClick={() => {
          logEvent(event, { product_id: productId, ...(data ?? {}) });
          onMarkCandidate(productId);
        }}
      >
        <i className="bi bi-heart-fill" />
      </button>
    </Tooltip>
  );
}

interface DiscardProductButtonProps extends ButtonProps {
  onDiscard: (productId: number) => void;
}

/**
 * This component renders a button that handles discarding a product.
 *
 * @param {ButtonProps} props
 * @param {number} props.productId the ID of the product for which to render this button
 * @param {Event} props.event the event that is triggered when this button is clicked
 * @param {{ [key: string]: any }} props.data the data of the event
 * @param {(productId: number) => void} props.onDiscard the action to perform when this button is clicked
 * @param {boolean} props.isActive whether the button is active (clicked)
 * @constructor
 */
export function DiscardProductButton({ productId, event, data, onDiscard, isActive }: DiscardProductButtonProps) {
  return (
    <Tooltip title="Discard">
      <button
        type="button"
        className={`btn btn-sm ${isActive ? "btn-danger" : "btn-outline-danger"}`}
        onClick={() => {
          logEvent(event, { product_id: productId, ...(data ?? {}) });
          onDiscard(productId);
        }}
      >
        <i className="bi bi-trash-fill" />
      </button>
    </Tooltip>
  );
}
