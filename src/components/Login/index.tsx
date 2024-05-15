import React, { useEffect } from "react";
import { LoginButton, LogoutButton, clientId } from "../../api/googleApi";
import { gapi } from "gapi-script";

interface Props {}

export const LoginComponent = (props: Props) => {
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId,
        scope: "",
      });
    };

    gapi.load("client:auth2", start);
  }, []);
  return (
    <div>
      <LoginButton />
      <LogoutButton />
    </div>
  );
};
