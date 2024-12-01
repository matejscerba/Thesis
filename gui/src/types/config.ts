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

export interface AppConfig {
  app_flow_type: AppFlowType;
}

export interface UserStudySetupStep {
  category_name: string;
  ui_type: UIType;
}
