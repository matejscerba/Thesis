export enum QuestionType {
  LIKERT = "LIKERT",
  OPEN = "OPEN",
  YES_NO = "YES_NO",
  UI_TYPE_COMPARISON = "UI_TYPE_COMPARISON",
  GENDER = "GENDER",
}

export interface Question {
  title: string;
  type: QuestionType;
}

export interface Response {
  response: string;
  whyResponse?: string;
}

export interface QuestionWithResponse extends Question {
  response: string;
  why_response: string;
}
