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
  userStudyTutorialPattern,
} from "./routes";
import OverallQuestionnaire from "./pages/OverallQuestionnaire";
import { useConfig } from "./contexts/config";
import UserStudyTutorial from "./pages/UserStudyTutorial";

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
            path: userStudyTutorialPattern,
            element: <UserStudyTutorial />,
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
