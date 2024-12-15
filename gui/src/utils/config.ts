import { UIType } from "../types/config";

/**
 * Gets the textual representation of a given UI type.
 *
 * @param {UIType} uiType the UI type for which to get the text
 * @return {string} the textual representation of the UI type
 */
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

/**
 * Gets the image filename of a given UI type.
 *
 * @param {UIType} uiType the UI type for which to get the filename
 * @return {string} the image filename of the UI type
 */
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
