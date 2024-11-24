import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { routes } from "../../router/routes";

export const DonationButton = () => {
  const [donationButton, setDonationButton] = useState<HTMLElement | null>(
    null
  );
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>();
  let path = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      if (!donationButton) {
        const button = document.getElementById("bmc-wbtn");
        if (button) {
          setDonationButton(button);
        }
      }
    }, 100);

    setIntervalId(interval);
  }, [(window as any).donation]);

  useEffect(() => {
    if (
      donationButton &&
      (path.pathname.includes(`${routes.app}/${routes.play}`) ||
        path.pathname.includes(routes.main))
    ) {
      donationButton.style.display = "none";
    } else if (donationButton) {
      donationButton.style.display = "flex";
    }

    if (donationButton && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);

      donationButton.style.width = "45px";
      donationButton.style.height = "45px";
      donationButton.style.top = "11px";
      donationButton.style.right = "10px";
    }
  }, [donationButton, path.pathname]);

  return <div></div>;
};
