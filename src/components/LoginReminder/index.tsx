import React, { useContext, useEffect, useState } from "react";
import { store } from "../../context";
import LoginReminder from "./LoginReminder";

export const LoginReminderConntainer: React.FC = () => {
  const {
    state: { userData,  },
  } = useContext(store);
  console.log('userData', userData);
  const [isOpen, setIsOpen] = useState(!userData);
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(!userData);
  }, [userData]);
  console.log('isOpen', isOpen);
  return (
    <>{!!userData && <LoginReminder open={isOpen} onClose={handleClose} />}</>
  );
};
