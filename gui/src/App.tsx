import React from "react";
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
  userStudyOverallQuestionnairePattern,
  userStudyStepCategoryPattern,
  userStudyStepQuestionnairePattern,
} from "./routes";
import OverallQuestionnaire from "./pages/OverallQuestionnaire";
import { useConfig } from "./contexts/config";
import UserStudyIntro from "./pages/UserStudyIntro";
import InitialQuestionnaire from "./pages/InitialQuestionnaire";

/**
 * This component renders the app and uses React router to navigate through pages.
 *
 * @constructor
 */
export function App() {
  const { appFlowType } = useConfig();

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
        ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
