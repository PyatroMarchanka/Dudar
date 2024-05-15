import {
  GoogleLogin,
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import React from "react";

export const clientId =
  "158430825596-3plj5oqkr2bt9inutdg5lvi0orh6j8ki.apps.googleusercontent.com";

type Props = {};

const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  console.log("onSuccess", (res as GoogleLoginResponse).profileObj);
};

const onSuccessLogout = () => {
  console.log("onSuccessLogout");
};


const onFailure = (err: any) => {
  console.log("onFailure", err);
};

export function LoginButton({}: Props) {
  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        isSignedIn={true}
      />
    </div>
  );
}

export function LogoutButton({}: Props) {
  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccessLogout}
      />
    </div>
  );
}
