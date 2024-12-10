import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userStudyInitialQuestionnairePattern } from "../routes";
import UserStudySteps from "./userStudy/UserStudySteps";

function UserStudyTutorialCarousel() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [<p>Slide 1</p>, <p>Slide 2</p>, <UserStudySteps />];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">{items[currentIndex]}</Box>
      </Box>

      <Box
        sx={{
          pb: 4,
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 0,
          width: "70%",
        }}
      >
        <Button variant="contained" disabled={currentIndex === 0} onClick={prevSlide}>
          Previous
        </Button>
        {currentIndex === items.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => {
              navigate(userStudyInitialQuestionnairePattern);
            }}
          >
            Go to initial questionnaire
          </Button>
        ) : (
          <Button variant="contained" onClick={nextSlide}>
            Next
          </Button>
        )}
      </Box>
    </>
  );
}

export default UserStudyTutorialCarousel;
