import Typography from "@mui/material/Typography";
import React from "react";
import ListItem from "@mui/material/ListItem";
import { Product as ProductModel } from "../types/product";
import { useAttributes } from "../contexts/attributes";
import { Divider } from "@mui/material";

interface ProductProps {
  className?: string;
  product: ProductModel;
  category: string;
  menu: React.ReactNode;
}

function Product({ className, product, category, menu }: ProductProps) {
  const { attributes } = useAttributes();

  const priceText = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  })
    .format(product.price)
    .replace(/,/g, " ");
  return (
    <ListItem>
      <div className={`${className} product`}>
        <div className="product-header">
          <div className="product-image-wrapper">
            <img className="product-image" src={`media/products/${category}/${product.id}.jpeg`} />
          </div>
          <div className="product-main-info">
            <Typography variant="h6">{product.name}</Typography>
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
      </div>
    </ListItem>
  );
}

export default Product;
