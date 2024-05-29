import Typography from "@mui/material/Typography";
import React from "react";
import ListItem from "@mui/material/ListItem";
import { Product as ProductModel } from "../types/product";

interface ProductProps {
  className?: string;
  product: ProductModel;
  category: string;
  menu: React.ReactNode;
}

function Product({ className, product, category, menu }: ProductProps) {
  const priceText = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  })
    .format(product.price)
    .replace(/,/g, " ");
  return (
    <ListItem>
      <div className={`${className} product-box`}>
        <div className="product-image-wrapper">
          <img className="product-image" src={`media/products/${category}/${product.id}.jpeg`} />
        </div>
        <div className="product-main-info">
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body1">{priceText}</Typography>
        </div>
        {menu}
      </div>
    </ListItem>
  );
}

export default Product;
