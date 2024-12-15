import React from "react";
import Typography from "@mui/material/Typography";
import { StoppingCriterionItem } from "../../types/stoppingCriteria";
import FilteredProducts from "../products/FilteredProducts";
import { useModal } from "../../contexts/modal";
import ExplanationAttribute from "../products/ExplanationAttribute";
import { ProductAttributePosition } from "../../types/product";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { useConfig } from "../../contexts/config";

interface StoppingCriterionProps {
  criterion: StoppingCriterionItem;
}

/**
 * This component renders a single stopping criterion.
 *
 * @param {StoppingCriterionProps} props
 * @param {StoppingCriterionItem} props.criterion the stopping criterion to be rendered
 * @constructor
 */
function StoppingCriterion({ criterion }: StoppingCriterionProps) {
  const { presentModal } = useModal();
  const { debug } = useConfig();

  const filter = [...criterion.supportSet, ...criterion.attributeValue];

  return (
    <div className="m-3 py-3 px-2 border border-dark rounded bg-white">
      {criterion.supportSet.length > 0 && (
        <>
          <Typography variant="body1" className="text-center">
            Out of products with
          </Typography>
          <div className="flex-wrapper py-2 justify-content-center">
            {criterion.supportSet.map((item) => (
              <ExplanationAttribute
                key={item.attribute.name}
                attribute={item.attribute}
                filter={item.filter}
                position={ProductAttributePosition.NEUTRAL}
              />
            ))}
          </div>
        </>
      )}
      <Typography variant="body1" className="text-center">
        You prefer products with
      </Typography>
      <div className="flex-wrapper py-2 justify-content-center">
        {criterion.attributeValue.map((item) => (
          <ExplanationAttribute
            key={item.attribute.name}
            attribute={item.attribute}
            filter={item.filter}
            position={ProductAttributePosition.NEUTRAL}
          />
        ))}
      </div>
      <Typography
        variant="body1"
        className="text-center clickable"
        onClick={() => {
          logEvent(Event.STOPPING_CRITERION_OPENED, { criterion });
          presentModal(<FilteredProducts filter={filter} />);
        }}
      >
        {criterion.numProducts} more products with these properties found.
      </Typography>
      {debug && (
        <Typography variant="body1" className="text-end">
          {criterion.metric}
        </Typography>
      )}
    </div>
  );
}

export default StoppingCriterion;
