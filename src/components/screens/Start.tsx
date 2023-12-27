import { useHistory } from "react-router-dom";
import { Onboarding } from "../StartScreen";
import { getUserOnboardingFinished } from "../../constants/localStorage";
import { routes } from "../../router/routes";
import { useEffect } from "react";

export const Start = () => {
  const history = useHistory();
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  useEffect(() => {
    if (isUserOnboardingCompleted) {
      history.replace(routes.main);
    }
  }, [history, isUserOnboardingCompleted]);

  return <Onboarding />;
};
