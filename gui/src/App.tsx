import React, { useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import { fetchJson } from "./utils/api";
import { AppConfig, AppFlowType } from "./types/config";
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

/**
 * This component renders the app and uses React router to navigate through pages.
 *
 * @constructor
 */
export function App() {
  const [data, setData] = useState<AppConfig>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchJson<AppConfig>("config")
      .then((config) => {
        setLoading(false);
        setData(config);
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, []);

  if (!data || loading) {
    return <p>Loading...</p>; // TODO: Categories skeleton
  }

  const routes =
    data.app_flow_type === AppFlowType.PRODUCTION
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
