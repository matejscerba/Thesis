import React from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { indexPattern } from "../routes";

function OverallQuestionnaire() {
  const navigate = useNavigate();
  // const [data, setData] = useState<UserStudySetupStep[]>(undefined);
  //
  // useEffect(() => {
  //   fetchJson<UserStudySetupStep[]>("user_study/steps")
  //     .then((steps) => {
  //       setData(steps);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

  return (
    <div className="mt-5">
      <Typography variant="h2" className="text-center">
        Overall questionnaire
      </Typography>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          type="button"
          className="btn btn-lg btn-primary mx-auto"
          onClick={() => {
            navigate(indexPattern);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default OverallQuestionnaire;
