import React, { useEffect, useState } from "react";
import TutorialCarousel from "../components/userStudy/TutorialCarousel";
import { useSearchParams } from "react-router-dom";
import { fetchPostJson } from "../utils/api";
import Typography from "@mui/material/Typography";

/**
 * This component renders the tutorial introduction to the user study.
 *
 * @constructor
 */
function UserStudyIntro() {
  const [errorMessage, setErrorMessage] = useState<string>(undefined);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const prolificId = searchParams.get("prolific_id");
    if (prolificId) {
      fetchPostJson<{ success: boolean }>("set_prolific_id", { prolific_id: prolificId })
        .then((response) => {
          if (!response.success) {
            setErrorMessage("An error occurred when saving your Prolific ID. Try again.");
          }
        })
        .catch((e) => {
          console.error(e);
          setErrorMessage("An error occurred when saving your Prolific ID. Try again.");
        });
    }
  }, []);

  return (
    <div className="mt-5">
      {errorMessage && (
        <div className="bg-danger-subtle">
          <Typography variant="body1" className="m-2 p-0">
            {errorMessage}
          </Typography>
        </div>
      )}
      {!errorMessage && <TutorialCarousel />}
    </div>
  );
}

export default UserStudyIntro;
