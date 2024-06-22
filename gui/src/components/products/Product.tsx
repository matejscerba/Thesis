import Typography from "@mui/material/Typography";
import React from "react";
import ListItem from "@mui/material/ListItem";
import { Product as ProductModel } from "../../types/product";
import { useAttributes } from "../../contexts/attributes";
import { Divider } from "@mui/material";
import Explanations from "./Explanations";
import { useCategory } from "../../contexts/category";
import { PRICE } from "../../types/attribute";
import { valueToString } from "../../utils/attributes";

interface ProductProps {
  className?: string;
  product: ProductModel;
  menu: React.ReactNode;
  showExplanation?: boolean;
}

function Product({ className, product, menu, showExplanation }: ProductProps) {
  const { attributes, price } = useAttributes();
  const { name } = useCategory();

  const priceText = valueToString(product.attributes[PRICE], price);

  return (
    <ListItem>
      <div className={`${className} product`}>
        <div className="product-header">
          <div className="product-image-wrapper">
            <img className="product-image" src={`media/products/${name}/${product.id}.jpeg`} />
          </div>
          <div className="product-main-info">
            <Typography variant="h6">{product.attributes.name}</Typography>
            <Typography variant="body1">{priceText}</Typography>
          </div>
          {menu}
        </div>
        <Divider className="border border-top-0 border-secondary" />
        {attributes ? (
          <div className="product-attributes py-2">
            {attributes.map((attribute) => (
              <div key={attribute.name} className="product-attribute-column px-2">
                <div className="name">
                  <Typography variant="body1">{attribute.name}</Typography>
                </div>
                <div className="value">
                  <Typography variant="body1">
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {product.attributes[attribute.full_name] ?? "-"}
                    {attribute.unit && `${attribute.unit === '"' ? "" : " "}${attribute.unit}`}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="body1">Loading attributes...</Typography>
        )}
        {showExplanation && (
          <>
            <Divider className="border border-top-0 border-secondary" />
            <Explanations productId={product.id} />
          </>
        )}
      </div>
    </ListItem>
  );
}

export default Product;
