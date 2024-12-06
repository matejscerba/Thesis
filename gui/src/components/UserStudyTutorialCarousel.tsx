import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { userStudyStepCategoryPattern } from "../routes";

function UserStudyTutorialCarousel() {
  const navigate = useNavigate();
  const { firstCategoryName } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [
    { id: 1, title: "Slide 1", description: "Description for Slide 1" },
    { id: 2, title: "Slide 2", description: "Description for Slide 2" },
    { id: 3, title: "Slide 3", description: "Description for Slide 3" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <Box sx={{ position: "relative", width: "80%", margin: "auto", mt: 4 }}>
      <Box
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h5">{items[currentIndex].title}</Typography>
          <Typography>{items[currentIndex].description}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" disabled={currentIndex === 0} onClick={prevSlide}>
          Previous
        </Button>
        {currentIndex === items.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => {
              navigate(generatePath(userStudyStepCategoryPattern, { step: "1", name: firstCategoryName }));
            }}
          >
            Go to step 1
          </Button>
        ) : (
          <Button variant="contained" onClick={nextSlide}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default UserStudyTutorialCarousel;
