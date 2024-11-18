import React, { useContext } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { loginServer } from "../../api/user";
import { store } from "../../context";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";

const GoogleAuth = () => {
  const {
    setUserData
  } = useContext(store);
  const history = useHistory();

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

  const onSuccess = async (cred: any) => {
    const res = await loginServer({
      credential: cred.credential,
      client_id: cred.clientId,
    });

    setUserData(res.data);
    history.push(routes.main);

  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          onSuccess(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
