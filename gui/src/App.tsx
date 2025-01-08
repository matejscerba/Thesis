import React, { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import { AppFlowType } from "./types/config";
import StepQuestionnaire from "./pages/StepQuestionnaire";
import {
  categoryPattern,
  indexPattern,
  userStudyInitialQuestionnairePattern,
  userStudyOutroPattern,
  userStudyOverallQuestionnairePattern,
  userStudyStepCategoryPattern,
  userStudyStepQuestionnairePattern,
} from "./routes";
import OverallQuestionnaire from "./pages/OverallQuestionnaire";
import { useConfig } from "./contexts/config";
import UserStudyIntro from "./pages/UserStudyIntro";
import InitialQuestionnaire from "./pages/InitialQuestionnaire";
import UserStudyOutro from "./pages/UserStudyOutro";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

/**
 * This component renders the app and uses React router to navigate through pages.
 *
 * @constructor
 */
export function App() {
  const { appFlowType } = useConfig();
  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);

  // Assign routes based on appFlowType
  const routes =
    appFlowType === AppFlowType.PRODUCTION
      ? [
          {
            path: indexPattern,
            element: <Categories />,
          },
          {
            path: categoryPattern,
            element: <Category />,
          },
        ]
      : [
          {
            path: indexPattern,
            element: <UserStudyIntro />,
          },
          {
            path: userStudyInitialQuestionnairePattern,
            element: <InitialQuestionnaire />,
          },
          {
            path: userStudyStepCategoryPattern,
            element: <Category />,
          },
          {
            path: userStudyStepQuestionnairePattern,
            element: <StepQuestionnaire />,
          },
          {
            path: userStudyOverallQuestionnairePattern,
            element: <OverallQuestionnaire />,
          },
          {
            path: userStudyOutroPattern,
            element: <UserStudyOutro />,
          },
        ];

  const router = createBrowserRouter(routes);

  return (
    <>
      {!warningDismissed && (
        <div className="bg-warning-subtle d-flex justify-content-between">
          <Typography variant="body1" className="m-2 p-0">
            There is a problem with some browsers. If some section of the page is not loading or you encounter an error
            repeatedly, try a different browser, please.
          </Typography>
          <Button
            className="btn-sm btn-outline-warning"
            onClick={() => {
              setWarningDismissed(true);
            }}
          >
            <i className="bi bi-x" />
          </Button>
        </div>
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
