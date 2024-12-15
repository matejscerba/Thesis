import Typography from "@mui/material/Typography";
import React from "react";

/**
 * This component renders a tutorial introduction for products.
 *
 * @constructor
 */
function ProductsIntro() {
  return (
    <div>
      <Typography variant="h3">Products</Typography>
      <Typography variant="body1">
        The products are organized in a single list when you open a category, you can perform three actions with each
        product by clicking a button in the right part of the product's box:
      </Typography>
      <ul>
        <li>Select it as your final choice and go to the next step</li>
        <li>Move it to Candidates</li>
        <li>Discard it</li>
      </ul>
      <img src="/media/images/product.png" alt="Product" />
      <Typography variant="body1">
        After you select at least a Candidate, the category of products is divided into 4 groups:
      </Typography>
      <ul>
        <li>Candidates</li>
        <li>Unseen statistics or Stopping criteria (based on the current interface)</li>
        <li>Alternatives</li>
        <li>Discarded products</li>
      </ul>
      <Typography variant="body1">
        Each Important attribute of each product is enhanced with colour-coded explanation of its value.
      </Typography>
      <Typography variant="h4">Candidates</Typography>
      <Typography variant="body1">Candidates are the products you like and consider purchasing.</Typography>
      <img src="/media/images/candidates.png" alt="Candidates" />
      <Typography variant="h4">Unseen statistics</Typography>
      <Typography variant="body1">
        Unseen statistics show you statistics about products you have not yet seen. You are presented with statistics
        based on Important attributes. You can display all the products satisfying each statistic and add each one of
        them to Candidates or discard them.
      </Typography>
      <img src="/media/images/unseen_statistics.png" alt="Candidates" />
      <Typography variant="h4">Stopping criteria</Typography>
      <Typography variant="body1">
        Your preferences based on Important attributes, Candidates and Discarded products represent complex properties
        of the products you prefer and show you how many more products satisfying these properties you have not seen
        yet. You can display all the products satisfying the properties and add each one of them to Candidates or
        discard them.
      </Typography>
      <img src="/media/images/stopping_criteria.png" alt="Stopping criteria" />
      <Typography variant="h4">Alternatives</Typography>
      <Typography variant="body1">
        You are presented with multiple alternatives to your Candidates, these products should correspond to your
        preferences based on Candidates.
      </Typography>
      <img src="/media/images/alternatives.png" alt="Alternatives" />
      <Typography variant="h4">Discarded products</Typography>
      <Typography variant="body1">All of the products you discarded are displayed in an individual list.</Typography>
      <img src="/media/images/discarded.png" alt="Discarded products" />
    </div>
  );
}

export default ProductsIntro;
