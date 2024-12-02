import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepQuestionnairePattern } from "../../routes";
import React from "react";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";

interface ButtonProps {
  productId: number;
  event: Event;
  data?: { [key: string]: any };
}

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

export function MoveToCandidatesButton({ productId, event, data }: ButtonProps) {
  const { onMarkCandidate } = useCategory();

  return (
    <Tooltip title="Move to candidates">
      <button
        type="button"
        className="btn btn-sm btn-outline-success me-2"
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

export function DiscardProductButton({ productId, event, data }: ButtonProps) {
  const { onDiscard } = useCategory();

  return (
    <Tooltip title="Discard">
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
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
