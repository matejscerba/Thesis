import React, { createContext, useContext, useEffect, useState } from "react";
import { AppConfig, AppFlowType, UIType } from "../types/config";
import { fetchJson } from "../utils/api";

interface ConfigContextInterface {
  appFlowType: AppFlowType;
  getUIType: (stepParam: string | undefined) => UIType;
}

const ConfigContext = createContext<ConfigContextInterface>({
  appFlowType: AppFlowType.PRODUCTION,
  getUIType: () => UIType.STOPPING_CRITERIA,
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

  if (!data || loading) {
    return <p>Loading...</p>;
  }

  return (
    <ConfigContext.Provider
      value={{
        appFlowType: data.app_flow.type,
        getUIType,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
