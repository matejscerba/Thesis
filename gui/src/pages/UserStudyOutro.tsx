import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { fetchJson } from "../utils/api";
import { indexPattern } from "../routes";
import { useNavigate } from "react-router-dom";

/**
 * This component renders the outro to the user study.
 *
 * @constructor
 */
function UserStudyOutro() {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [validProlificResponse, setValidProlificResponse] = useState<boolean>(null);
  const [studyId, setStudyId] = useState<string>(null);

  useEffect(() => {
    fetchJson<{ success: boolean; study_id: string }>("check_prolific_id")
      .then((response) => {
        setValidProlificResponse(response.success);
        setStudyId(response.study_id);
        setLoaded(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <div className="mt-5">
      <Typography variant="h2">Thank you for completing the user study!</Typography>
      {loaded && (
        <div className="d-flex justify-content-center align-items-center mt-5">
          {validProlificResponse && studyId ? (
            <button
              type="button"
              className="btn btn-lg btn-outline-primary text-center"
              onClick={() => {
                window.location.href = `https://app.prolific.com/submissions/complete?cc=${studyId}`;
              }}
            >
              Finish your Prolific study
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-lg btn-outline-primary text-center"
              onClick={() => {
                navigate(indexPattern);
              }}
            >
              Return to home page
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserStudyOutro;
