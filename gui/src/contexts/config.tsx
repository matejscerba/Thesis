import React, { createContext, useContext, useEffect, useState } from "react";
import { AppConfig, AppFlowType, UIType, UserStudySetupStep } from "../types/config";
import { fetchJson } from "../utils/api";

/**
 * Represents the config context interface.
 */
interface ConfigContextInterface {
  /**
   * The flow type of the application.
   */
  appFlowType: AppFlowType;

  /**
   * The steps of the user study.
   */
  userStudySteps: UserStudySetupStep[] | undefined;

  /**
   * Gets the UI type for a given user study step.
   *
   * @param {string} stepParam string representation of the step for which to get the UI type
   * @return {UIType} UI type for a given user study step
   */
  getUIType: (stepParam: string | undefined) => UIType;

  /**
   * Gets the category name for a given user study step.
   *
   * @param {string} stepParam string representation of the step for which to get the category name
   * @return {string | undefined} category name for a given user study step
   */
  getCategoryName: (stepParam: string | undefined) => string | undefined;

  /**
   * Whether a debug mode is active.
   */
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

/**
 * This component wraps its children into context providing all information regarding the configuration of the whole
 * application.
 *
 * @param {ConfigContextProviderProps} props
 * @param {React.ReactNode} props.children the children (react node) to be wrapped into this provider
 * @constructor
 */
export function ConfigContextProvider({ children }: ConfigContextProviderProps) {
  const [data, setData] = useState<AppConfig>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // Load the configuration only the first time this component is rendered
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

  /**
   * Gets the UI type for a given user study step.
   *
   * @param {string} stepParam string representation of the step for which to get the UI type
   * @return {UIType} UI type for a given user study step
   */
  const getUIType = (stepParam: string | undefined): UIType => {
    if (stepParam === undefined) {
      return data.production_ui_type;
    }
    return data.app_flow.setup.steps[Number.parseInt(stepParam) - 1].ui_type;
  };

  /**
   * Gets the category name for a given user study step.
   *
   * @param {string} stepParam string representation of the step for which to get the category name
   * @return {string | undefined} category name for a given user study step
   */
  const getCategoryName = (stepParam: string | undefined): string | undefined => {
    if (stepParam === undefined) {
      return undefined;
    }
    return data.app_flow.setup.steps[Number.parseInt(stepParam) - 1].category_name;
  };

  // Render nothing when the data is not loaded
  if (!data || loading) {
    return null;
  }

  return (
    <ConfigContext.Provider
      value={{
        appFlowType: data.app_flow.type,
        userStudySteps: data.app_flow.setup?.steps,
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
