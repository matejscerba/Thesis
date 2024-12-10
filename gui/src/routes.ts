export const indexPattern = "/";
export const categoryPattern = `${indexPattern}category/:name/`;
export const userStudyPattern = `${indexPattern}user_study/`;
export const userStudyStepPattern = `${indexPattern}user_study/step/:step/`;
export const userStudyStepCategoryPattern = `${userStudyStepPattern}category/:name/`;
export const userStudyStepQuestionnairePattern = `${userStudyStepPattern}questionnaire/`;
export const userStudyQuestionnairePattern = `${userStudyPattern}questionnaire/`;
