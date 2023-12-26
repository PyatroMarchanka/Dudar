import { useState } from "react";
import { ChooseLanguage } from "./ChooseLanguage";
import { ChooseBagpipe } from "./ChooseBagpipe";
import { ChooseTuning } from "./ChooseTuning";
import styled from "styled-components";
import { Button } from "../global/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { userOnboardingFinished } from "../../constants/localStorage";
import { routes } from "../../router/routes";
import { mainColors } from "../../utils/theme";

enum OnbordingSteps {
  Language = "language",
  Bagpipe = "bagpipe",
  Tuning = "tuning",
}
const onbordingSteps: OnbordingSteps[] = [
  OnbordingSteps.Language,
  OnbordingSteps.Bagpipe,
  OnbordingSteps.Tuning,
];
const getStepComponent = (step: number) => {
  switch (onbordingSteps[step]) {
    case OnbordingSteps.Language:
      return <ChooseLanguage />;

    case OnbordingSteps.Bagpipe:
      return <ChooseBagpipe />;

    case OnbordingSteps.Tuning:
      return <ChooseTuning />;

    default:
      return <ChooseLanguage />;
  }
};

export const Onboarding = () => {
  const { t } = useTranslation("translation");
  const [step, setStep] = useState<number>(0);
  const stepComponent = getStepComponent(step);
  const history = useHistory();

  const onFinish = () => {
    localStorage.setItem(userOnboardingFinished, "true");
    history.push(routes.main);
  };

  return (
    <Container>
      {stepComponent}
      <Buttons>
        {step > 0 && (
          <Button onClick={() => setStep(step - 1)}>{t("onboarding.previousStep")}</Button>
        )}
        {step < onbordingSteps.length - 1 && (
          <Button onClick={() => setStep(step + 1)}>{t("onboarding.nextStep")}</Button>
        )}
        {step === onbordingSteps.length - 1 && (
          <Button onClick={onFinish}>{t("onboarding.finish")}</Button>
        )}
      </Buttons>
      <SkipButton>
        <Button color={mainColors.darkerGray} onClick={onFinish}>{t("onboarding.skip")}</Button>
      </SkipButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 20px;
`;

const SkipButton = styled(Buttons)`
  margin-top: 100px;
`