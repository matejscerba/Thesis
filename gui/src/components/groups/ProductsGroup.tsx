import { Product as ProductModel, ProductGroupType } from "../../types/product";
import React from "react";
import Typography from "@mui/material/Typography";
import Product from "../products/Product";
import { getColor, getEmptyMessage, getMenuForProduct } from "../../utils/products";

interface ProductsGroupProps {
  products: ProductModel[];
  groupType: ProductGroupType;
}

function ProductsGroup({ products, groupType }: ProductsGroupProps) {
  return (
    <>
      {products.length ? (
        products.map((product) => (
          <Product
            className={`border border-${getColor(groupType)} rounded bg-white`}
            key={`${product.id}`}
            product={product}
            menu={getMenuForProduct(product, groupType)}
          />
        ))
      ) : (
        <Typography variant="body1" className="mx-3">
          {getEmptyMessage(groupType)}
        </Typography>
      )}
    </>
  );
}

export default ProductsGroup;
