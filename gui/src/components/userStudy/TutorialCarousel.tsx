import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userStudyInitialQuestionnairePattern } from "../../routes";
import UserStudySteps from "./UserStudySteps";
import TutorialIntro from "./TutorialIntro";
import AttributesIntro from "./AttributesIntro";
import ProductsIntro from "./ProductsIntro";

/**
 * This component renders a carousel that shows the tutorial for the whole system.
 *
 * @constructor
 */
function TutorialCarousel() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [<TutorialIntro />, <AttributesIntro />, <ProductsIntro />, <UserStudySteps />];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <>
      <Box className="tutorial-carousel">
        <Box className="tutorial-carousel-content">{items[currentIndex]}</Box>
      </Box>

      <Box className="tutorial-carousel-footer">
        <Button variant="contained" disabled={currentIndex === 0} onClick={prevSlide}>
          Previous step
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
            Next step
          </Button>
        )}
      </Box>
    </>
  );
}

export default TutorialCarousel;
