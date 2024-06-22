import Typography from "@mui/material/Typography";
import React from "react";
import NumericalAttributeRange from "../attributes/NumericalAttributeRange";
import CategoricalAttributeRange from "../attributes/CategoricalAttributeRange";
import { AttributeType } from "../../types/attribute";
import { useCategory } from "../../contexts/category";

function Unseen() {
  const { unseen } = useCategory();

  return (
    <>
      <Typography variant="h5" className="text-secondary mx-3">
        Unseen
      </Typography>
      {unseen.attributes.map((stats) => (
        <div key={stats.attribute.name} className="m-3 border border-secondary rounded">
          <Typography variant="h6" className="mx-2">
            {stats.attribute.name}
          </Typography>
          {stats.attribute.type === AttributeType.CATEGORICAL.valueOf() && (
            <CategoricalAttributeRange
              attribute={stats.attribute}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              selectedOptions={stats.selected_options}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              availableOptions={stats.available_options}
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
      ))}
    </>
  );
}

export default Unseen;
