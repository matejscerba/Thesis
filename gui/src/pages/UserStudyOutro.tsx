import React from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { indexPattern } from "../routes";

/**
 * This component renders the outro to the user study.
 *
 * @constructor
 */
function UserStudyOutro() {
  const navigate = useNavigate();

  return (
    <div className="mt-5">
      <Typography variant="h2">Thank you for completing the user study!</Typography>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          type="button"
          className="btn btn-lg btn-outline-primary text-center"
          onClick={() => {
            navigate(indexPattern);
          }}
        >
          Go to home page
        </button>
      </div>
    </div>
  );
}

export default UserStudyOutro;
