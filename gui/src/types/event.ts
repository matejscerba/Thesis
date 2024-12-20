/**
 * Represents type of event.
 */
export enum Event {
  ATTRIBUTE_ADDED_TO_IMPORTANT = "ATTRIBUTE_ADDED_TO_IMPORTANT",
  ATTRIBUTE_REMOVED_FROM_IMPORTANT = "ATTRIBUTE_REMOVED_FROM_IMPORTANT",
  UNSEEN_STATISTIC_OPENED = "UNSEEN_STATISTIC_OPENED",
  STOPPING_CRITERION_OPENED = "STOPPING_CRITERION_OPENED",
  ALTERNATIVE_FINAL_CHOICE_SELECTED = "ALTERNATIVE_FINAL_CHOICE_SELECTED",
  ALTERNATIVE_FINAL_CHOICE_CONFIRMED = "ALTERNATIVE_FINAL_CHOICE_CONFIRMED",
  ALTERNATIVE_ADDED_TO_CANDIDATES = "ALTERNATIVE_ADDED_TO_CANDIDATES",
  ALTERNATIVE_DISCARDED = "ALTERNATIVE_DISCARDED",
  FILTERED_FINAL_CHOICE_SELECTED = "FILTERED_FINAL_CHOICE_SELECTED",
  FILTERED_FINAL_CHOICE_CONFIRMED = "FILTERED_FINAL_CHOICE_CONFIRMED",
  FILTERED_PRODUCT_ADDED_TO_CANDIDATES = "FILTERED_PRODUCT_ADDED_TO_CANDIDATES",
  FILTERED_PRODUCT_DISCARDED = "FILTERED_PRODUCT_DISCARDED",
  DISCARDED_FINAL_CHOICE_SELECTED = "DISCARDED_FINAL_CHOICE_SELECTED",
  DISCARDED_FINAL_CHOICE_CONFIRMED = "DISCARDED_FINAL_CHOICE_CONFIRMED",
  DISCARDED_ADDED_TO_CANDIDATES = "DISCARDED_ADDED_TO_CANDIDATES",
  CANDIDATE_FINAL_CHOICE_SELECTED = "CANDIDATE_FINAL_CHOICE_SELECTED",
  CANDIDATE_FINAL_CHOICE_CONFIRMED = "CANDIDATE_FINAL_CHOICE_CONFIRMED",
  CANDIDATE_DISCARDED = "CANDIDATE_DISCARDED",
  INITIAL_QUESTIONNAIRE_SUBMITTED = "INITIAL_QUESTIONNAIRE_SUBMITTED",
  STEP_QUESTIONNAIRE_SUBMITTED = "STEP_QUESTIONNAIRE_SUBMITTED",
  OVERALL_QUESTIONNAIRE_SUBMITTED = "OVERALL_QUESTIONNAIRE_SUBMITTED",
}
