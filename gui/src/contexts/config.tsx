import React, { createContext, useContext, useEffect, useState } from "react";
import { AppConfig, AppFlowType, UIType, UserStudySetupStep } from "../types/config";
import { fetchJson } from "../utils/api";

interface ConfigContextInterface {
  appFlowType: AppFlowType;
  userStudySteps: UserStudySetupStep[] | undefined;
  getUIType: (stepParam: string | undefined) => UIType;
  getCategoryName: (stepParam: string | undefined) => string | undefined;
  debug: boolean;
}

const ConfigContext = createContext<ConfigContextInterface>({
  appFlowType: AppFlowType.PRODUCTION,
  userStudySteps: undefined,
  getUIType: () => UIType.STOPPING_CRITERIA,
  getCategoryName: () => undefined,
  debug: false,
});

interface ConfigContextProviderProps {
  children: React.ReactNode;
}

export function ConfigContextProvider({ children }: ConfigContextProviderProps) {
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

  const getUIType = (stepParam: string | undefined) => {
    if (stepParam === undefined) {
      return data.production_ui_type;
    }
    return data.app_flow.setup.steps[Number.parseInt(stepParam) - 1].ui_type;
  };

  const getCategoryName = (stepParam: string | undefined) => {
    if (stepParam === undefined) {
      return undefined;
    }
    return data.app_flow.setup.steps[Number.parseInt(stepParam) - 1].category_name;
  };

  if (!data || loading) {
    return <p>Loading...</p>;
  }

  return (
    <ConfigContext.Provider
      value={{
        appFlowType: data.app_flow.type,
        userStudySteps: data.app_flow.setup.steps,
        getUIType,
        getCategoryName,
        debug: data.debug,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
