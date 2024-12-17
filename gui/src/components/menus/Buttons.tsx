import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";
import React from "react";
import { Tooltip } from "@mui/material";
import { Product } from "../../types/product";
import { useModal } from "../../contexts/modal";
import Typography from "@mui/material/Typography";

interface ButtonProps {
  product: Product;
  clickEvent: Event;
  data?: { [key: string]: any };
  isActive?: boolean;
}

interface FinalChoiceSelectedButtonProps extends ButtonProps {
  confirmEvent: Event;
}

/**
 * This component renders a button that handles selecting a product as a final choice.
 *
 * @param {ButtonProps} props
 * @param {Product} props.product the product for which to render this button
 * @param {Event} props.clickEvent the event that is triggered when this button is clicked
 * @param {Event} props.confirmEvent the event that is triggered when the popup is confirmed
 * @param {{ [key: string]: any }} props.data the data of the event
 * @constructor
 */
export function FinalChoiceSelectedButton({ product, clickEvent, confirmEvent, data }: FinalChoiceSelectedButtonProps) {
  const { step } = useParams();
  const navigate = useNavigate();
  const { presentModal, hideModal } = useModal();

  return (
    step !== undefined && (
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary me-2"
        onClick={() => {
          logEvent(clickEvent, { product_id: product.id, ...(data ?? {}) });
          presentModal(
            <div className="p-2">
              <Typography variant="body1" className="mb-4">
                Are you reasonably sure {product.name} is the best product for you?
              </Typography>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => {
                    logEvent(confirmEvent, { product_id: product.id, ...(data ?? {}) });
                    navigate(generatePath(userStudyStepQuestionnairePattern, { step }));
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    hideModal();
                  }}
                >
                  No
                </button>
              </div>
            </div>,
          );
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
 * @param {number} props.product the product for which to render this button
 * @param {Event} props.clickEvent the event that is triggered when this button is clicked
 * @param {{ [key: string]: any }} props.data the data of the event
 * @param {(productId: number) => void} props.onMarkCandidate the action to perform when this button is clicked
 * @param {boolean} props.isActive whether the button is active (clicked)
 * @constructor
 */
export function MoveToCandidatesButton({
  product,
  clickEvent,
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
          logEvent(clickEvent, { product_id: product.id, ...(data ?? {}) });
          onMarkCandidate(product.id);
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
 * @param {number} props.product the product for which to render this button
 * @param {Event} props.clickEvent the event that is triggered when this button is clicked
 * @param {{ [key: string]: any }} props.data the data of the event
 * @param {(productId: number) => void} props.onDiscard the action to perform when this button is clicked
 * @param {boolean} props.isActive whether the button is active (clicked)
 * @constructor
 */
export function DiscardProductButton({ product, clickEvent, data, onDiscard, isActive }: DiscardProductButtonProps) {
  return (
    <Tooltip title="Discard">
      <button
        type="button"
        className={`btn btn-sm ${isActive ? "btn-danger" : "btn-outline-danger"}`}
        onClick={() => {
          logEvent(clickEvent, { product_id: product.id, ...(data ?? {}) });
          onDiscard(product.id);
        }}
      >
        <i className="bi bi-trash-fill" />
      </button>
    </Tooltip>
  );
}
