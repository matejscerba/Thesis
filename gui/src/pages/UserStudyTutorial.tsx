import React from "react";
import Typography from "@mui/material/Typography";
import UserStudyTutorialCarousel from "../components/UserStudyTutorialCarousel";

function UserStudyTutorial() {
  return (
    <div className="mt-5">
      <Typography variant="h2" className="text-center mb-3">
        Tutorial
      </Typography>
      <UserStudyTutorialCarousel />
    </div>
  );
}

export default UserStudyTutorial;
