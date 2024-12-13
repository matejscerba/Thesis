export enum AppFlowType {
  PRODUCTION = "PRODUCTION",
  USER_STUDY = "USER_STUDY",
}

export enum UIType {
  UNSEEN_STATISTICS = "UNSEEN_STATISTICS",
  STOPPING_CRITERIA = "STOPPING_CRITERIA",
}

export function getUITypeText(uiType: UIType): string {
  switch (uiType) {
    case UIType.STOPPING_CRITERIA:
      return "stopping criteria";
    case UIType.UNSEEN_STATISTICS:
      return "unseen statistics";
    default:
      return "unknown UI type";
  }
}

export function getUITypeImageFilename(uiType: UIType): string {
  switch (uiType) {
    case UIType.STOPPING_CRITERIA:
      return "stopping_criteria_questionnaire.png";
    case UIType.UNSEEN_STATISTICS:
      return "unseen_statistics_questionnaire.png";
    default:
      return "";
  }
}

interface UserStudySetup {
  steps: UserStudySetupStep[];
}

interface AppFlow {
  type: AppFlowType;
  setup?: UserStudySetup;
}

export interface AppConfig {
  app_flow: AppFlow;
  production_ui_type: UIType;
  debug: boolean;
}

export interface UserStudySetupStep {
  category_name: string;
  ui_type: UIType;
}
