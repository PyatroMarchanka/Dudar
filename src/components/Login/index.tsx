import React, { useEffect } from "react";
import { Button } from "../global/Button";

interface Props {}

export const LoginComponent = (props: Props) => {
  console.log(`${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`)
  return (
    <div>
      <a href={`${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`}>
        <Button>Sign in with Google</Button>
      </a>
      <Button>Logout</Button>
    </div>
  );
};
