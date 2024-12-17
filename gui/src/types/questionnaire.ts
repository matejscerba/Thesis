/**
 * Represents the type of question.
 */
export enum QuestionType {
  LIKERT = "LIKERT",
  OPEN = "OPEN",
  YES_NO = "YES_NO",
  UI_TYPE_COMPARISON = "UI_TYPE_COMPARISON",
  AGE = "AGE",
  GENDER = "GENDER",
}

/**
 * Represents the question.
 */
export interface Question {
  /**
   * The title of the question.
   */
  title: string;

  /**
   * The type of the question.
   */
  type: QuestionType;
}

/**
 * Represents the response.
 */
export interface Response {
  /**
   * The main response.
   */
  response: string;

  /**
   * The additional 'Why?' response.
   */
  whyResponse?: string;
}

/**
 * Represents the question with response.
 */
export interface QuestionWithResponse extends Question {
  /**
   * The main response.
   */
  response: string;

  /**
   * The additional 'Why?' response.
   */
  why_response: string;
}
