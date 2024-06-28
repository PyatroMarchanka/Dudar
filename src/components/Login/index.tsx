import React from "react";
import styled from "styled-components";
import { Icon } from "../global/Icon";
import { mainColors } from "../../utils/theme";

interface Props {}

export const LoginComponent = (props: Props) => {
  console.log(`${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`);
  return (
    <div>
      <a href={`${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`}>
        <GoogleButton>
          <Icon className="icon" type="google" />
          Sign in with Google
        </GoogleButton>
      </a>
    </div>
  );
};

const GoogleButton = styled.button`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  float: left;
  width: 100%;
  height: 50px;
  border-radius: 2.5px;
  font-size: 17.5px !important;
  color: rgba(0, 0, 0, 0.54);
  letter-spacing: 0.27px;
  line-height: 50px;
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  border: 1px solid #dadce0;
  background: ${mainColors.lightestGrey};
  cursor: pointer;

  &:hover {
    border-color: #d2e3fc;
    background: rgba(66, 133, 244, 0.04);
  }

  .icon {
    margin-right: 20px;
  }
`;
