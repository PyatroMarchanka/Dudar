import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { mainColors } from "../../utils/theme";

export const DonationButton = () => {
  const [donationButton, setDonationButton] = useState<HTMLElement | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!donationButton) {
        const button = document.getElementById("bmc-wbtn");
        if (button) {
          setDonationButton(button);
        }
      }
    }, 100);

    setIntervalId(interval)
  }, [(window as any).donation]);

  useEffect(() => {
    if(donationButton && intervalId){
        clearInterval(intervalId)
        setIntervalId(null)

        donationButton.style.width = '45px'
        donationButton.style.height = '45px'
        donationButton.style.top = '11px'
        donationButton.style.right = '10px'
        // donationButton.style.background = mainColors.darkestRed
        // const firstChild = (donationButton.firstElementChild! as HTMLImageElement);
        // firstChild.src = 'images/beer.svg'
        // firstChild.style.width = '30px'
        // firstChild.style.height = '30px'

    }
  }, [donationButton])

  return <div></div>;
};
