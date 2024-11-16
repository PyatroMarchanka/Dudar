import { useHistory } from "react-router-dom";
import { Onboarding } from "../StartScreen";
import { getUserOnboardingFinished } from "../../constants/localStorage";
import { routes } from "../../router/routes";
import { useContext, useEffect } from "react";
import { store } from "../../context";

export const Start = () => {
  const history = useHistory();
  const {
    state: { userData },
  } = useContext(store);
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  useEffect(() => {
    if (userData || isUserOnboardingCompleted) {
      history.replace(routes.app);
    }
  }, [history, isUserOnboardingCompleted]);

  return <Onboarding />;
};
