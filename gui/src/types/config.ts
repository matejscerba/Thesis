/**
 * Represents type of application flow.
 */
export enum AppFlowType {
  PRODUCTION = "PRODUCTION",
  USER_STUDY = "USER_STUDY",
}

/**
 * Represents UI type.
 */
export enum UIType {
  UNSEEN_STATISTICS = "UNSEEN_STATISTICS",
  STOPPING_CRITERIA = "STOPPING_CRITERIA",
}

/**
 * Represents setup of a user study.
 */
interface UserStudySetup {
  /**
   * Steps of the user study.
   */
  steps: UserStudySetupStep[];
}

/**
 * Represents the flow setup of the application.
 */
interface AppFlow {
  /**
   * The type of the application flow.
   */
  type: AppFlowType;

  /**
   * The setup of the user study.
   */
  setup?: UserStudySetup;
}

/**
 * Represents configuration of the application.
 */
export interface AppConfig {
  /**
   * The flow of the application.
   */
  app_flow: AppFlow;

  /**
   * The production UI type.
   */
  production_ui_type: UIType;

  /**
   * Whether debug mode is active.
   */
  debug: boolean;
}

/**
 * Represents step of a user study.
 */
export interface UserStudySetupStep {
  /**
   * Name of the category of the current step.
   */
  category_name: string;

  /**
   * The UI type of the current step.
   */
  ui_type: UIType;
}
