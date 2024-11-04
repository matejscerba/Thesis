import { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { StoppingCriteria as StoppingCriteriaModel, StoppingCriteriaResponse } from "../../types/stoppingCriteria";
import { useAttributes } from "../../contexts/attributes";
import { useCategory } from "../../contexts/category";
import React from "react";
import Typography from "@mui/material/Typography";
import StoppingCriterion from "./StoppingCriterion";

function StoppingCriteria() {
  const { attributes, attributeNames } = useAttributes();
  const { name, candidateIds, discarded } = useCategory();

  const [data, setData] = useState<StoppingCriteriaModel>(undefined);

  useEffect(() => {
    fetchPostJson<StoppingCriteriaResponse>(
      "stopping_criteria",
      { candidates: candidateIds, discarded, important_attributes: attributeNames },
      { category_name: name },
    )
      .then((criteria) => {
        console.warn(criteria);
        setData({
          ...criteria,
          preferenceDetected: criteria.preference_detected,
          items: criteria.items.map((item) => ({
            ...item,
            numProducts: item.num_products,
            attributeValue: item.attribute_value.map((attribute) => ({
              attribute: attributes.find((attr) => attr.full_name === attribute.attribute_name),
              filter: {
                ...attribute.filter,
                lowerBound: attribute.filter.lower_bound,
                upperBound: attribute.filter.upper_bound,
              },
            })),
            supportSet: item.support_set.map((attribute) => ({
              ...attribute,
              attribute: attributes.find((attr) => attr.full_name === attribute.attribute_name),
              filter: {
                ...attribute.filter,
                lowerBound: attribute.filter.lower_bound,
                upperBound: attribute.filter.upper_bound,
              },
            })),
          })),
        } as StoppingCriteriaModel);
      })
      .catch((e) => console.error(e));
  }, [candidateIds, discarded, attributeNames]);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  return (
    <>
      <Typography variant="h5" className="text-dark mx-3">
        Stopping criteria
      </Typography>
      {data.items && data.items.length > 0 ? (
        data.items.map((criterion, idx) => <StoppingCriterion key={`${idx}`} criterion={criterion} />)
      ) : (
        <Typography variant="body1" className="mx-3 my-2">
          No stopping criteria detected. Make sure you have some candidate products and important attributes selected.
        </Typography>
      )}
    </>
  );
}

export default StoppingCriteria;
