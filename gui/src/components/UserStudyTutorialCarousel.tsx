import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import { userStudyStepCategoryPattern } from "../routes";
import UserStudySteps from "./userStudy/UserStudySteps";
import { UserStudySetupStep } from "../types/config";
import { fetchJson } from "../utils/api";

function UserStudyTutorialCarousel() {
  const navigate = useNavigate();

  const [data, setData] = useState<UserStudySetupStep[]>(undefined);

  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [<p>Slide 1</p>, <p>Slide 2</p>, <UserStudySteps steps={data} />];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    fetchJson<UserStudySetupStep[]>("user_study/steps")
      .then((steps) => {
        setData(steps);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

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
              navigate(generatePath(userStudyStepCategoryPattern, { step: "1", name: data?.[0].category_name }));
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
    </>
  );
}

export default UserStudyTutorialCarousel;
