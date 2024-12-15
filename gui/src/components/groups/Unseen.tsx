import Typography from "@mui/material/Typography";
import React from "react";
import NumericalAttributeRange from "../attributes/NumericalAttributeRange";
import CategoricalAttributeRange from "../attributes/CategoricalAttributeRange";
import { AttributeType } from "../../types/attribute";
import { useCategory } from "../../contexts/category";

/**
 * This component renders title of the section describing important attributes of not yet seen products.
 *
 * @constructor
 */
export function UnseenTitle() {
  return (
    <Typography variant="h5" className="text-dark mx-3">
      Unseen statistics
    </Typography>
  );
}

/**
 * This component renders the section describing important attributes of not yet seen products.
 *
 * @constructor
 */
function Unseen() {
  const { unseen } = useCategory();

  return (
    <div className="mb-3">
      <UnseenTitle />
      {unseen.attributes && unseen.attributes.length > 0 ? (
        unseen.attributes.map((stats) => (
          <div key={stats.attribute.name} className="m-3 border border-dark rounded bg-white">
            {stats.attribute.type === AttributeType.CATEGORICAL.valueOf() && (
              <CategoricalAttributeRange
                attribute={stats.attribute}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                selectedOptions={stats.selected_options ?? []}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                availableOptions={stats.available_options ?? stats.options}
                numProductsInRange={stats.num_products}
              />
            )}
            {stats.attribute.type === AttributeType.NUMERICAL.valueOf() && (
              <NumericalAttributeRange
                attribute={stats.attribute}
                lowerBoundIndex={stats.lower_bound_index}
                upperBoundIndex={stats.upper_bound_index}
                options={stats.options}
                numProductsInRange={stats.num_products}
              />
            )}
          </div>
        ))
      ) : (
        <Typography variant="body1" className="mx-3 my-2">
          No unseen statistics detected based on Candidates, Discarded products and Important attributes.
        </Typography>
      )}
    </div>
  );
}

export default Unseen;
