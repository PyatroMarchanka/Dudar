import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { loginServer } from "../../api/user";

const GoogleAuth = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

  const onSuccess = async (cred: any) => {
    const res = await loginServer({
      credential: cred.credential,
      client_id: cred.clientId,
    });

    console.log("res", res.data);
  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log(credentialResponse);
          onSuccess(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <button
        onClick={() => {
          console.log("check");
          console.log(document.cookie);
        }}
      >
        check
      </button>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
