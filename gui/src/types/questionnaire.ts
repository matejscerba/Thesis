export enum QuestionType {
  SCALE = "SCALE",
  OPEN = "OPEN",
}

export interface Question {
  title: string;
  type: QuestionType;
}

export interface QuestionWithResponse extends Question {
  response: string | number;
}
