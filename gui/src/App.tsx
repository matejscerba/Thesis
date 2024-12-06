import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import { AppFlowType } from "./types/config";
import UserStudyIntro from "./pages/UserStudyIntro";
import Questionnaire from "./pages/Questionnaire";
import {
  categoryPattern,
  indexPattern,
  userStudyQuestionnairePattern,
  userStudyStepCategoryPattern,
  userStudyStepQuestionnairePattern,
} from "./routes";
import OverallQuestionnaire from "./pages/OverallQuestionnaire";
import { useConfig } from "./contexts/config";

/**
 * This component renders the app and uses React router to navigate through pages.
 *
 * @constructor
 */
export function App() {
  const { appFlowType } = useConfig();

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
            path: userStudyStepCategoryPattern,
            element: <Category />,
          },
          {
            path: userStudyStepQuestionnairePattern,
            element: <Questionnaire />,
          },
          {
            path: userStudyQuestionnairePattern,
            element: <OverallQuestionnaire />,
          },
        ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
