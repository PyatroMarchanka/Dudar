import { useState } from "react";
import { ChooseLanguage } from "./ChooseLanguage";
import { ChooseBagpipe } from "./ChooseBagpipe";
import { ChooseTuning } from "./ChooseTuning";
import styled from "styled-components";
import { Button } from "../global/Button";

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
  const [step, setStep] = useState<number>(0);
  const stepComponent = getStepComponent(step);

  const onFinish = () => {
    localStorage.setItem("userOnboardingFinished", "true");
  };

  return (
    <Container>
      {stepComponent}
      <Buttons>
        {step > 0 && <Button onClick={() => setStep(step - 1)}>Previous step</Button>}
        {step < onbordingSteps.length - 1 && (
          <Button onClick={() => setStep(step + 1)}>Next step</Button>
        )}
        {step === onbordingSteps.length - 1 && <Button onClick={onFinish}>Finish</Button>}
      </Buttons>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height:100vh ;
`;

const Buttons = styled.div`
  display: flex;
`;
