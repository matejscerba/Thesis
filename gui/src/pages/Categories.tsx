import { useEffect, useState } from "react";
import { fetchJson } from "../utils/api";
import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";

/**
 * This component renders the menu of categories.
 *
 * @constructor
 */
function Categories() {
  const [categories, setCategories] = useState<string[]>(undefined);

  useEffect(() => {
    // Load the categories from server
    fetchJson<string[]>("categories")
      .then((response) => {
        setCategories(response);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="mt-5">
      <Typography variant="h2" className="text-center">
        Categories
      </Typography>
      <div className="mt-5 categories-wrapper">
        {categories?.map((category) => (
          <Link key={category} to={`/category/${category}`} className="categories-item text-decoration-none text-black">
            <div className="border border-secondary rounded m-2 categories-inner bg-white">
              <div className="categories-image-wrapper">
                <img alt={category} src={`/media/products/${category}/1.jpg`} className="categories-image" />
              </div>
              <Typography variant="h3" className="categories-name">
                {capitalizeFirstLetter(category)}
              </Typography>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;
