import Typography from "@mui/material/Typography";
import React from "react";
import NumericalAttributeRange from "../NumericalAttributeRange";
import CategoricalAttributeRange from "../CategoricalAttributeRange";
import { AttributeType } from "../../types/attribute";
import { UnseenStatistics } from "../../types/statistics";

interface UnseenProps {
  category: string;
  statistics: UnseenStatistics;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function Unseen({ category, statistics, onDiscard, onMarkCandidate }: UnseenProps) {
  return (
    <>
      <Typography variant="h5" className="text-secondary mx-3">
        Unseen
      </Typography>
      {statistics.attributes.map((stats) => (
        <div key={stats.attribute.name} className="m-3 border border-secondary rounded">
          <Typography variant="h6" className="mx-2">
            {stats.attribute.name}
          </Typography>
          {stats.attribute.type === AttributeType.CATEGORICAL.valueOf() && (
            <CategoricalAttributeRange
              category={category}
              attribute={stats.attribute}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              selectedOptions={stats.selected_options}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              availableOptions={stats.available_options}
              numProductsInRange={stats.num_products}
              onDiscard={onDiscard}
              onMarkCandidate={onMarkCandidate}
            />
          )}
          {stats.attribute.type === AttributeType.NUMERICAL.valueOf() && (
            <NumericalAttributeRange
              category={category}
              attribute={stats.attribute}
              lowerBoundIndex={stats.lower_bound_index}
              upperBoundIndex={stats.upper_bound_index}
              options={stats.options}
              numProductsInRange={stats.num_products}
              onDiscard={onDiscard}
              onMarkCandidate={onMarkCandidate}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default Unseen;
