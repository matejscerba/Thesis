import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import { Product as ProductModel, ProductExplanation } from "../../types/product";
import { useAttributes } from "../../contexts/attributes";
import { useCategory } from "../../contexts/category";
import { getTextColor, valueToString } from "../../utils/attributes";
import ExplanationAttribute from "./ExplanationAttribute";
import { fetchPostJson } from "../../utils/api";
import PositionTooltip from "./PositionTooltip";
import { getProductExplanationMessageInfo } from "../../utils/products";
import { Tooltip } from "@mui/material";

interface ProductProps {
  className?: string;
  product: ProductModel;
  menu: React.ReactNode;
  showExplanation?: boolean;
}

function Product({ className, product, menu }: ProductProps) {
  const { price, attributeNames } = useAttributes();
  const { name, candidateIds, discarded } = useCategory();

  const [explanation, setExplanation] = useState<ProductExplanation>(undefined);

  useEffect(() => {
    fetchPostJson<ProductExplanation>(
      "explanation",
      { candidates: candidateIds, discarded, important_attributes: attributeNames },
      { category_name: name, product_id: `${product.id}` },
    )
      .then((result) => {
        setExplanation(result);
      })
      .catch((e) => console.error(e));
  }, [candidateIds, discarded, attributeNames]);

  const explanationInfo = getProductExplanationMessageInfo(explanation?.message);

  return (
    <ListItem>
      <div className={`${className} product`}>
        <div className="product-header">
          <div className="product-image-wrapper">
            <img className="product-image" alt={product.name} src={`/media/products/${name}/${product.id}.jpg`} />
          </div>
          <div className="product-main-info">
            <Typography variant="h6">{product.name}</Typography>
            <PositionTooltip position={explanation?.price_position} attribute={price}>
              <Typography
                variant="body1"
                className={`text-${getTextColor(explanation?.price_position)} fit-content d-inline-block`}
              >
                {valueToString(product.price, price)}
              </Typography>
            </PositionTooltip>
            {product.rating !== undefined && product.rating !== null && (
              <Typography variant="body1" className="fit-content d-inline-block" sx={{ float: "right" }}>
                {product.rating} <i className="bi bi-star-fill text-warning" />
              </Typography>
            )}
          </div>
          {menu}
        </div>
        {explanation && (
          <>
            <div className="flex-wrapper py-2">
              {explanation.attributes.map((attribute) => (
                <ExplanationAttribute
                  key={attribute.attribute.name}
                  attribute={attribute.attribute}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  value={attribute.attribute_value}
                  position={attribute.position}
                />
              ))}
            </div>
            {explanationInfo && (
              <div className="explanation-wrapper py-1 px-2">
                <Tooltip title={explanationInfo.info}>
                  <Typography variant="body1" className="text-center">
                    {explanationInfo.text}
                  </Typography>
                </Tooltip>
              </div>
            )}
          </>
        )}
      </div>
    </ListItem>
  );
}

export default Product;
