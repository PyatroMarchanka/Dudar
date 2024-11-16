import { Languages } from "../interfaces";

export const userOnboardingFinished = "userOnboardingFinished";
export const userLanguage = "userLanguage";

export const getUserOnboardingFinished = () =>
  !!localStorage.getItem(userOnboardingFinished);

export const getUserLanguage = (): Languages | null =>
  !!localStorage.getItem(userLanguage) as unknown as Languages;
