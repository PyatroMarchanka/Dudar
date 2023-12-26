import { Redirect } from "react-router-dom";
import { Onboarding } from "../StartScreen";
import { userOnboardingFinished } from "../../constants/localStorage";
import { routes } from "../../router/routes";

export const Start = () => {
  const isUserOnboardingCompleted = localStorage.getItem(userOnboardingFinished);

  return !isUserOnboardingCompleted ? (
    <Onboarding />
  ) : (
    <Redirect
      to={{
        pathname: routes.main,
      }}
    />
  );
};
