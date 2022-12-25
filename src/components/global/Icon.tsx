import React from "react";
import styled from "styled-components";
import { theme } from "../../utils/theme";

interface Props {
  type:
    | "radom"
    | "play"
    | "pause"
    | "stop"
    | "guitar"
    | "notes"
    | "midi"
    | "material"
    | "rotate"
    | "metr_on"
    | "metr_off"
    | "hamb"
    | "settings"
    | "music"
    | "song-play"
    | "back";
  className?: string;
  fill?: string;
  disabled?: boolean;
  Icon?: any;
}

////wdvwvwvdwvw

export const Icon = styled(
  ({ type, className, fill = theme.colors.black, disabled, Icon }: Props) => {
    const getClassName = () => `${className} ${disabled ? "disabled" : ""}`;

    if (Icon && type === "material") {
      return (
        <Icon
          fontSize="large"
          className={className}
          style={{ color: disabled ? "rgba(179, 179, 179, 0.3)" : fill }}
        />
      );
    }
    switch (type) {
      case "radom":
        return (
          <svg
            fill={fill}
            className={getClassName()}
            role="img"
            focusable="false"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
          >
            <path d="M 5.459789,4.64957 Q 5.058009,5.26564 4.542379,6.4777 4.395059,6.17636 4.294609,5.9922 4.194169,5.80805 4.023409,5.56698 3.852649,5.32591 3.681889,5.18863 3.511129,5.05136 3.260009,4.95426 3.008899,4.85716 2.714259,4.85716 H 1.214255 q -0.09375,0 -0.154018,-0.0603 Q 0.999969,4.73666 0.999969,4.64287 V 3.35716 q 0,-0.0937 0.06027,-0.15402 0.06027,-0.0603 0.154018,-0.0603 h 1.500004 q 1.6741,0 2.74553,1.5067 z m 7.54018,5.35045 q 0,0.0937 -0.0603,0.15402 l -2.14285,2.14285 q -0.0603,0.0603 -0.15402,0.0603 -0.0871,0 -0.15067,-0.0636 -0.0636,-0.0636 -0.0636,-0.15067 v -1.28571 q -0.21428,0 -0.5692,0.003 -0.35491,0.003 -0.54241,0.007 -0.1875,0.003 -0.48884,-0.007 -0.30133,-0.0101 -0.47544,-0.0335 -0.17411,-0.0234 -0.42857,-0.0703 -0.25447,-0.0469 -0.42188,-0.12388 -0.16741,-0.077 -0.38839,-0.19085 -0.22098,-0.11384 -0.39509,-0.26786 -0.17411,-0.15401 -0.3683,-0.35825 -0.1942,-0.20425 -0.375,-0.46541 0.39509,-0.62276 0.91071,-1.82812 0.14732,0.30134 0.24777,0.48549 0.10044,0.18415 0.2712,0.42522 0.17076,0.24107 0.34152,0.37835 0.17076,0.13728 0.42188,0.23438 0.25111,0.0971 0.54576,0.0971 h 1.71428 V 7.85687 q 0,-0.0937 0.0603,-0.15402 0.0603,-0.0603 0.15402,-0.0603 0.0803,0 0.16071,0.067 l 2.13616,2.13616 q 0.0603,0.0603 0.0603,0.15402 z m 0,-6 q 0,0.0937 -0.0603,0.15401 l -2.14285,2.14286 q -0.0603,0.0603 -0.15402,0.0603 -0.0871,0 -0.15067,-0.0636 -0.0636,-0.0636 -0.0636,-0.15067 V 4.85721 h -1.71428 q -0.32143,0 -0.58259,0.10045 -0.26116,0.10044 -0.46206,0.30134 -0.20089,0.20089 -0.34152,0.41183 -0.14062,0.21093 -0.30133,0.51897 -0.21429,0.41518 -0.52233,1.14509 -0.19419,0.44196 -0.33147,0.7433 -0.13728,0.30134 -0.36161,0.70313 -0.22433,0.40178 -0.42857,0.66964 -0.20424,0.26786 -0.49553,0.5558 -0.2913,0.28795 -0.60268,0.45871 -0.31139,0.17076 -0.71317,0.28125 -0.40179,0.11049 -0.85714,0.11049 H 1.214245 q -0.09375,0 -0.154018,-0.0603 -0.060258,-0.0603 -0.060258,-0.15404 V 9.35716 q 0,-0.0937 0.06027,-0.15402 0.06027,-0.0603 0.154018,-0.0603 h 1.500004 q 0.32142,0 0.58258,-0.10044 0.26117,-0.10045 0.46206,-0.30134 0.20089,-0.20089 0.34152,-0.41183 0.14062,-0.21094 0.30134,-0.51898 0.21428,-0.41517 0.52232,-1.14508 0.19419,-0.44197 0.33147,-0.74331 0.13728,-0.30134 0.36161,-0.70312 0.22433,-0.40179 0.42857,-0.66965 0.20424,-0.26785 0.49553,-0.5558 0.2913,-0.28795 0.60268,-0.45871 0.31139,-0.17075 0.71317,-0.28124 0.40179,-0.1105 0.85715,-0.1105 h 1.71428 V 1.85713 q 0,-0.0937 0.0603,-0.15402 0.0603,-0.0603 0.15402,-0.0603 0.0803,0 0.16071,0.067 l 2.13616,2.13616 q 0.0603,0.0603 0.0603,0.15402 z" />
          </svg>
        );

      case "play":
        return (
          <svg
            width="60"
            height="61"
            viewBox="0 0 60 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.25" width="60" height="60" rx="30" fill="#A9142F" />
            <path
              d="M22.0232 41.6445V18.8555C22.0232 17.9853 22.9689 17.4446 23.7188 17.886L43.0793 29.2805C43.8185 29.7155 43.8185 30.7845 43.0793 31.2196L23.7188 42.614C22.9689 43.0554 22.0232 42.5147 22.0232 41.6445Z"
              fill="white"
            />
          </svg>
        );

      case "guitar":
        return (
          <svg
            className={className}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30px"
            height="30px"
            viewBox="0 0 25.917 25.917"
          >
            <g>
              <path
                fill={fill}
                d="M9.547,20.221c0.118,0.119,0.118,0.31,0,0.428l-0.642,0.643c-0.118,0.117-0.311,0.117-0.428,0
         L4.625,17.44c-0.119-0.119-0.119-0.311,0-0.429l0.642-0.642c0.118-0.119,0.31-0.119,0.428,0L9.547,20.221z M25.917,2.413v0.003
         c0,0.256-0.098,0.511-0.293,0.706l-0.421,0.421l0.164,0.164c0.205,0.206,0.205,0.538,0,0.744c-0.102,0.102-0.237,0.153-0.372,0.153
         s-0.269-0.05-0.372-0.153l-0.164-0.164l-0.256,0.256l0.164,0.164c0.205,0.206,0.205,0.538,0,0.744
         c-0.102,0.102-0.237,0.153-0.372,0.153s-0.269-0.05-0.372-0.153l-0.164-0.164l-0.198,0.198c-0.259,0.259-0.622,0.329-0.952,0.245
         l-4.357,4.357c1.146,1.31,2.575,3.602,1.088,5.774c-1.014,1.483-2.584,1.178-3.474,2.103c-1.001,1.042-0.2,3.903-2.817,6.52
         c-0.985,0.985-2.11,1.433-3.301,1.433c-1.977,0-4.136-1.235-6.134-3.313c-3.332-3.203-4.498-6.82-1.881-9.436
         C4.05,10.55,6.909,11.351,7.95,10.35c0.927-0.89,0.642-2.44,2.124-3.453c0.668-0.457,1.347-0.64,2.004-0.64
         c1.479,0,2.849,0.921,3.752,1.71l4.358-4.358c-0.085-0.331-0.014-0.693,0.245-0.952l0.198-0.198l-0.164-0.164
         c-0.205-0.206-0.205-0.538,0-0.744c0.205-0.205,0.539-0.205,0.744,0l0.164,0.164l0.256-0.256l-0.164-0.164
         c-0.205-0.206-0.205-0.538,0-0.744c0.205-0.205,0.539-0.205,0.744,0l0.164,0.164l0.421-0.421c0.195-0.195,0.451-0.293,0.707-0.293
         h0.003c0.256,0,0.511,0.098,0.705,0.293l1.414,1.414C25.819,1.902,25.917,2.157,25.917,2.413z M16.96,11.079l-3.359,3.359
         c0.007,0.073,0.022,0.144,0.022,0.219c0,1.306-1.058,2.364-2.364,2.364s-2.364-1.058-2.364-2.364s1.058-2.364,2.364-2.364
         c0.076,0,0.148,0.015,0.223,0.022l3.356-3.357c-0.777-0.662-1.799-1.302-2.76-1.302c-0.428,0-0.825,0.129-1.214,0.395
         c-0.454,0.31-0.601,0.681-0.841,1.363c-0.209,0.595-0.47,1.336-1.104,1.944c-0.7,0.674-1.617,0.84-2.588,1.016
         c-1.218,0.221-2.598,0.471-3.908,1.782c-0.697,0.699-1.032,1.465-1.023,2.346c0.015,1.51,1.039,3.319,2.884,5.091
         c0.014,0.013,0.026,0.026,0.039,0.04c1.788,1.86,3.608,2.884,5.125,2.884c0.867,0,1.623-0.335,2.311-1.023
         c1.31-1.309,1.56-2.691,1.782-3.91c0.176-0.971,0.342-1.888,1.016-2.589c0.614-0.639,1.364-0.895,1.966-1.1
         c0.684-0.233,1.056-0.376,1.362-0.823C18.826,13.697,17.827,12.086,16.96,11.079z M21.652,3.689l2-2
         c0.117-0.117,0.117-0.307,0-0.424s-0.307-0.117-0.424,0l-2,2c-0.117,0.117-0.117,0.307,0,0.424
         c0.059,0.059,0.135,0.088,0.212,0.088C21.518,3.777,21.594,3.748,21.652,3.689z M24.652,2.265c-0.117-0.117-0.307-0.117-0.424,0
         l-2,2c-0.117,0.117-0.117,0.307,0,0.424c0.059,0.059,0.135,0.088,0.212,0.088s0.153-0.029,0.212-0.088l2-2
         C24.77,2.572,24.769,2.382,24.652,2.265z"
              />
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>
        );

      case "notes":
        return (
          <svg
            className={className}
            fill={fill}
            version="1.1"
            width="25px"
            height="25px"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 477.867 477.867"
            enableBackground={"new 0 0 477.867 477.867"}
          >
            <g>
              <g>
                <path
                  d="M472.184,4.347c-3.631-3.209-8.441-4.75-13.261-4.25l-307.2,34.133c-8.647,0.957-15.19,8.265-15.189,16.964V355.34
             c-15.468-9.256-33.174-14.102-51.2-14.012C38.281,341.329,0,371.946,0,409.595s38.281,68.267,85.333,68.267
             s85.333-30.601,85.333-68.267V151.889l273.067-30.413v199.68c-15.473-9.238-33.179-14.066-51.2-13.961
             c-47.053,0-85.333,30.618-85.333,68.267c0,37.649,38.281,68.267,85.333,68.267s85.333-30.601,85.333-68.267v-358.4
             C477.866,12.208,475.8,7.584,472.184,4.347z"
                />
              </g>
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>
        );

      case "midi":
        return (
          <svg
            className={className}
            version="1.1"
            viewBox="0 0 1000 455"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              aria-label="M"
              text-data="M"
              d="M137,96h233c19.6,0,31,16.9,31,37v229h-65V163h-38v199h-59V163h-37v199h-65V96z"
            />
            <rect
              aria-label="I"
              text-data="I"
              x="433"
              y="96"
              width="65"
              height="266"
            />
            <path
              aria-label="D"
              text-data="D"
              d="M529,96h193c19.6,0,31,16.9,31,37v196c0,24.9-10.4,33-33,33H529V193h66v104h93V156H529V96z"
            />
            <rect
              aria-label="I"
              text-data="I"
              x="783"
              y="96"
              width="66"
              height="266"
            />
          </svg>
        );
      case "rotate":
        return (
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 122.88 106.43"
            className={className}
            // style={{ enableBackground: "new 0 0 122.88 106.43" }}
          >
            <style type="text/css">
              {/* .st0{fill-rule:evenodd;clip-rule:evenodd;} */}
            </style>
            <g>
              <path
                className="st0"
                d="M11.1,0h35.63c3.05,0,5.85,1.25,7.85,3.25c2.03,2.03,3.25,4.8,3.25,7.85v31.46h-3.19V12.18H3.15v75.26l0,0
                h7.61v11.61c0,1.58,0.27,3.1,0.77,4.51H11.1c-3.05,0-5.85-1.25-7.85-3.25C1.22,98.27,0,95.51,0,92.45V11.1
                c0-3.05,1.25-5.85,3.25-7.85C5.28,1.22,8.04,0,11.1,0L11.1,0L11.1,0z M94.95,33.45c-0.37-5.8-2.64-10.56-6.06-13.97
                c-3.64-3.63-8.59-5.74-13.94-5.93l2.46,2.95c0.73,0.88,0.62,2.18-0.26,2.91c-0.88,0.73-2.18,0.62-2.91-0.26l-5.72-6.85l0,0
                c-0.72-0.86-0.62-2.14,0.22-2.88l6.71-5.89c0.86-0.75,2.16-0.66,2.91,0.19c0.75,0.86,0.66,2.16-0.19,2.91l-3.16,2.78
                c6.43,0.21,12.4,2.75,16.8,7.13c4.07,4.06,6.79,9.69,7.25,16.49l2.58-3.08c0.73-0.88,2.04-0.99,2.91-0.26
                c0.88,0.73,0.99,2.04,0.26,2.91l-5.73,6.84c-0.72,0.86-1.99,0.99-2.87,0.29l-6.98-5.56c-0.89-0.71-1.04-2.01-0.33-2.91
                c0.71-0.89,2.01-1.04,2.91-0.33L94.95,33.45L94.95,33.45z M122.88,59.7v35.63c0,3.05-1.25,5.85-3.25,7.85
                c-2.03,2.03-4.8,3.25-7.85,3.25h-78.9c-3.05,0-5.85-1.25-7.85-3.25c-2.03-2.03-3.25-4.8-3.25-7.85V59.7c0-3.05,1.25-5.85,3.25-7.85
                c2.03-2.03,4.79-3.25,7.85-3.25h78.9c3.05,0,5.85,1.25,7.85,3.25C121.66,53.88,122.88,56.64,122.88,59.7L122.88,59.7L122.88,59.7z
                 M35.41,77.49c0,2.51-2.03,4.57-4.57,4.57c-2.51,0-4.57-2.03-4.57-4.57c0-2.51,2.03-4.57,4.57-4.57
                C33.36,72.92,35.41,74.95,35.41,77.49L35.41,77.49L35.41,77.49z M37.88,51.75v51.49h72.82V51.75H37.88L37.88,51.75z"
              ></path>
            </g>
          </svg>
        );

      case "pause":
        return (
          <svg
            width="60"
            height="61"
            viewBox="0 0 60 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.25" width="60" height="60" rx="30" fill="#A9142F" />
            <path
              d="M22.9885 20.0278C22.3672 20.0278 21.8635 20.5315 21.8635 21.1528V39.3472C21.8635 39.9685 22.3672 40.4722 22.9885 40.4722H26.3933C27.0146 40.4722 27.5183 39.9685 27.5183 39.3472V21.1528C27.5183 20.5315 27.0146 20.0278 26.3933 20.0278H22.9885Z"
              fill="white"
            />
            <path
              d="M33.6068 20.0278C32.9855 20.0278 32.4818 20.5315 32.4818 21.1528V39.3472C32.4818 39.9685 32.9855 40.4722 33.6068 40.4722H37.0116C37.6329 40.4722 38.1366 39.9685 38.1366 39.3472V21.1528C38.1366 20.5315 37.6329 20.0278 37.0116 20.0278H33.6068Z"
              fill="white"
            />
          </svg>
        );

      case "stop":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.6721 25.1986L25.6721 6.80142C25.6721 6.09892 24.9087 5.6624 24.3033 6.01872L10.7396 14.0015V7.91364C10.7396 7.36135 10.2919 6.91364 9.73959 6.91364H7.32788C6.7756 6.91364 6.32788 7.36135 6.32788 7.91364V24.0864C6.32788 24.6386 6.7756 25.0864 7.32788 25.0864H9.73959C10.2919 25.0864 10.7396 24.6386 10.7396 24.0864V17.9985L24.3033 25.9813C24.9087 26.3376 25.6721 25.9011 25.6721 25.1986Z"
              fill="#1C0606"
            />
          </svg>
        );

      case "metr_on":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.6631 19.7848L24.5669 9.35043L26.1628 23.5037C26.493 26.4316 24.2559 29 21.3756 29H11.7166C8.83628 29 6.59919 26.4316 6.92935 23.5037L8.74912 7.36582C9.0297 4.87767 11.0886 3 13.5364 3H19.5558C21.546 3 23.2792 4.24134 24.0084 6.04287L16.8433 18.7067C16.7457 18.6954 16.6465 18.6897 16.546 18.6897C15.0943 18.6897 13.9175 19.8939 13.9175 21.3793C13.9175 22.8648 15.0943 24.069 16.546 24.069C17.9977 24.069 19.1746 22.8648 19.1746 21.3793C19.1746 20.7825 18.9846 20.231 18.6631 19.7848Z"
              fill="#1C0606"
            />
            <path
              d="M26.0614 6.283C26.9115 6.283 27.6007 5.57782 27.6007 4.70793C27.6007 3.83804 26.9115 3.13286 26.0614 3.13286C25.2113 3.13286 24.5221 3.83804 24.5221 4.70793C24.5221 5.57782 25.2113 6.283 26.0614 6.283Z"
              fill="#1C0606"
            />
          </svg>
        );

      case "metr_off":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.24219 6.07277L7.9372 3.72113C7.64987 3.20333 7.0146 3.02659 6.51829 3.32637C6.02198 3.62614 5.85258 4.28891 6.13991 4.8067L14.4663 19.8111C14.1488 20.2604 13.9611 20.8157 13.9611 21.4167C13.9611 22.9125 15.1234 24.125 16.5571 24.125C17.9908 24.125 19.153 22.9125 19.153 21.4167C19.153 19.9209 17.9908 18.7084 16.5571 18.7084C16.4578 18.7084 16.3599 18.7142 16.2635 18.7255L11.1409 9.49426L11.3497 7.60595C11.4807 6.42157 12.4419 5.52778 13.5847 5.52778H19.5295C20.6722 5.52778 21.6335 6.42157 21.7645 7.60595L23.5617 23.8559C23.7158 25.2496 22.6714 26.4722 21.3267 26.4722H11.7875C10.4428 26.4722 9.39837 25.2496 9.55251 23.856L10.3309 17.0001L8.29943 13.6895L7.14558 23.5662C6.82544 26.4608 8.99462 29 11.7875 29H21.3267C24.1196 29 26.2887 26.4608 25.9686 23.5662L24.1714 7.31621C23.8993 4.85633 21.9029 3 19.5295 3H13.5847C11.6317 3 9.93396 4.25692 9.24219 6.07277Z"
              fill="#1C0606"
            />
          </svg>
        );

      case "hamb":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.57563 10.6466C8.84589 10.6466 9.87563 9.61686 9.87563 8.3466C9.87563 7.07635 8.84589 6.0466 7.57563 6.0466C6.30538 6.0466 5.27563 7.07635 5.27563 8.3466C5.27563 9.61686 6.30538 10.6466 7.57563 10.6466Z"
              fill="#ffffff"
            />
            <path
              d="M25.7241 6.84659H12.7949V9.84659H25.7241C26.2764 9.84659 26.7241 9.39887 26.7241 8.84659V7.84659C26.7241 7.2943 26.2764 6.84659 25.7241 6.84659Z"
              fill="#ffffff"
            />
            <path
              d="M25.7241 14.8536H12.7949V17.8536H25.7241C26.2764 17.8536 26.7241 17.4059 26.7241 16.8536V15.8536C26.7241 15.3013 26.2764 14.8536 25.7241 14.8536Z"
              fill="#ffffff"
            />
            <path
              d="M12.7949 22.8606H25.7241C26.2764 22.8606 26.7241 23.3083 26.7241 23.8606V24.8606C26.7241 25.4129 26.2764 25.8606 25.7241 25.8606H12.7949V22.8606Z"
              fill="#ffffff"
            />
            <path
              d="M9.87563 16.3536C9.87563 17.6239 8.84589 18.6536 7.57563 18.6536C6.30538 18.6536 5.27563 17.6239 5.27563 16.3536C5.27563 15.0834 6.30538 14.0536 7.57563 14.0536C8.84589 14.0536 9.87563 15.0834 9.87563 16.3536Z"
              fill="#ffffff"
            />
            <path
              d="M7.57563 26.6606C8.84589 26.6606 9.87563 25.6309 9.87563 24.3606C9.87563 23.0904 8.84589 22.0606 7.57563 22.0606C6.30538 22.0606 5.27563 23.0904 5.27563 24.3606C5.27563 25.6309 6.30538 26.6606 7.57563 26.6606Z"
              fill="#ffffff"
            />
          </svg>
        );

      case "settings":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 11.6414C14.8151 11.6414 13.7953 12.0625 12.9404 12.9048C12.0856 13.747 11.6582 14.7577 11.6582 15.9368C11.6582 17.1328 12.0856 18.1519 12.9404 18.9942C13.7953 19.8364 14.8151 20.2575 16 20.2575C17.1849 20.2575 18.2047 19.8364 19.0596 18.9942C19.9144 18.1519 20.3418 17.1328 20.3418 15.9368C20.3418 14.7577 19.9144 13.747 19.0596 12.9048C18.2047 12.0625 17.1849 11.6414 16 11.6414ZM16 18.1098C15.4075 18.1098 14.8997 17.8993 14.4766 17.4781C14.0534 17.057 13.8418 16.5432 13.8418 15.9368C13.8418 15.3473 14.0534 14.8419 14.4766 14.4208C14.8997 13.9997 15.4075 13.7891 16 13.7891C16.5925 13.7891 17.1003 13.9997 17.5234 14.4208C17.9466 14.8419 18.1582 15.3473 18.1582 15.9368C18.1582 16.5432 17.9466 17.057 17.5234 17.4781C17.1003 17.8993 16.5925 18.1098 16 18.1098ZM24.9883 19.6006C25.0391 19.4995 25.1237 19.4027 25.2422 19.31C25.3607 19.2174 25.5299 19.171 25.75 19.171C26.6641 19.171 27.4342 18.8636 28.0605 18.2488C28.6869 17.6339 29 16.8633 29 15.9368C29 15.0272 28.6869 14.2608 28.0605 13.6375C27.4342 13.0143 26.6641 12.7026 25.75 12.7026H25.5215C25.4199 12.7026 25.3184 12.6774 25.2168 12.6268C25.1152 12.5763 25.0391 12.5005 24.9883 12.3994L24.8867 12.172C24.8359 12.0709 24.819 11.9404 24.8359 11.7804C24.8529 11.6203 24.9375 11.4645 25.0898 11.3129C25.6992 10.7234 26.0293 10.0369 26.0801 9.25364C26.1309 8.47036 25.9108 7.75025 25.4199 7.09329V6.79009L24.9883 6.56268C24.7174 6.29316 24.3958 6.08261 24.0234 5.931C23.651 5.7794 23.2533 5.7036 22.8301 5.7036C22.39 5.7036 21.9626 5.78361 21.5479 5.94363C21.1331 6.10366 20.765 6.3437 20.4434 6.66375C20.3418 6.78167 20.2148 6.84483 20.0625 6.85326C19.9102 6.86168 19.7832 6.84062 19.6816 6.79009C19.5801 6.84062 19.4827 6.80272 19.3896 6.67638C19.2965 6.55005 19.25 6.40266 19.25 6.23421C19.25 5.32458 18.9369 4.55815 18.3105 3.93489C17.6842 3.31163 16.9141 3 16 3C15.0859 3 14.3158 3.31163 13.6895 3.93489C13.0631 4.55815 12.75 5.32458 12.75 6.23421V6.46161C12.75 6.56268 12.7246 6.66375 12.6738 6.76482C12.623 6.86589 12.5384 6.94169 12.4199 6.99223L12.2168 7.09329C12.0983 7.16067 11.9629 7.1691 11.8105 7.11856C11.6582 7.06803 11.5059 6.99223 11.3535 6.89116C10.6934 6.25105 9.91895 5.931 9.03027 5.931C8.1416 5.931 7.39258 6.25105 6.7832 6.89116C6.13997 7.53126 5.82259 8.30191 5.83105 9.20311C5.83952 10.1043 6.19922 10.875 6.91016 11.5151C7.01172 11.633 7.06673 11.7677 7.0752 11.9193C7.08366 12.0709 7.0625 12.231 7.01172 12.3994C6.96094 12.5005 6.86361 12.5973 6.71973 12.69C6.57585 12.7826 6.41927 12.829 6.25 12.829C5.33593 12.829 4.56576 13.1364 3.93945 13.7512C3.31315 14.3661 3 15.1367 3 16.0632C3 16.9728 3.31315 17.7392 3.93945 18.3625C4.56576 18.9858 5.33593 19.2974 6.25 19.2974H6.47852C6.63086 19.2974 6.76204 19.3395 6.87207 19.4237C6.9821 19.5079 7.0625 19.609 7.11328 19.7269C7.16406 19.828 7.18099 19.9543 7.16406 20.1059C7.14714 20.2575 7.0625 20.4176 6.91016 20.586C6.57161 20.9061 6.32194 21.2556 6.16113 21.6346C6.00033 22.0136 5.91992 22.4137 5.91992 22.8348C5.91992 23.2222 5.99609 23.6012 6.14844 23.9718C6.30078 24.3424 6.51237 24.6877 6.7832 25.0078L6.91016 25.1088L7.21484 25.4373C7.875 25.9258 8.60286 26.1406 9.39844 26.0816C10.194 26.0227 10.9134 25.6984 11.5566 25.1088C11.6582 25.0078 11.7894 24.953 11.9502 24.9446C12.111 24.9362 12.2676 24.9572 12.4199 25.0078C12.5892 25.0583 12.7035 25.1425 12.7627 25.2604C12.8219 25.3784 12.8516 25.5468 12.8516 25.7658C12.8516 26.6754 13.1647 27.4419 13.791 28.0651C14.4173 28.6884 15.1875 29 16.1016 29C17.0326 29 17.807 28.6884 18.4248 28.0651C19.0426 27.4419 19.3516 26.6754 19.3516 25.7658V25.5384C19.3516 25.3699 19.3981 25.2352 19.4912 25.1341C19.5843 25.033 19.6816 24.9488 19.7832 24.8814C19.9017 24.8309 20.0371 24.8141 20.1895 24.8309C20.3418 24.8477 20.4941 24.9404 20.6465 25.1088C21.3066 25.749 22.0811 26.069 22.9697 26.069C23.8584 26.069 24.6074 25.749 25.2168 25.1088C25.86 24.4687 26.1774 23.6981 26.1689 22.7969C26.1605 21.8957 25.8008 21.125 25.0898 20.4849C25.0391 20.3165 24.9967 20.1565 24.9629 20.0049C24.929 19.8533 24.9375 19.7185 24.9883 19.6006ZM23.6934 21.9757C23.7949 22.0936 23.8753 22.2115 23.9346 22.3294C23.9938 22.4474 24.0234 22.5821 24.0234 22.7337C24.0234 22.9022 23.9938 23.0454 23.9346 23.1633C23.8753 23.2812 23.7949 23.3907 23.6934 23.4917C23.5918 23.5928 23.4818 23.6728 23.3633 23.7318C23.2448 23.7907 23.1009 23.8202 22.9316 23.8202C22.7624 23.8202 22.6185 23.7865 22.5 23.7191C22.3815 23.6518 22.2376 23.5423 22.0684 23.3907C21.6283 22.9527 21.1289 22.6832 20.5703 22.5821C20.0117 22.4811 19.4616 22.5653 18.9199 22.8348C18.3783 23.0538 17.9551 23.4075 17.6504 23.896C17.3457 24.3845 17.1934 24.8983 17.1934 25.4373V25.6395C17.1934 25.9764 17.0918 26.2417 16.8887 26.4354C16.6855 26.6291 16.4232 26.7259 16.1016 26.7259C15.7799 26.7259 15.5218 26.6291 15.3271 26.4354C15.1325 26.2417 15.0352 25.9764 15.0352 25.6395V25.5384C15.0352 24.9488 14.8617 24.4224 14.5146 23.9592C14.1676 23.4959 13.7233 23.1633 13.1816 22.9611C13.0124 22.8432 12.8262 22.7758 12.623 22.759C12.4199 22.7421 12.2083 22.7337 11.9883 22.7337C11.6159 22.7337 11.2477 22.8095 10.8838 22.9611C10.5199 23.1127 10.2025 23.3233 9.93164 23.5928C9.71159 23.8118 9.47461 23.9255 9.2207 23.9339C8.9668 23.9423 8.73828 23.8708 8.53516 23.7191L8.30664 23.2643H8.20508C8.1543 23.2138 8.12467 23.1464 8.11621 23.0622C8.10775 22.978 8.10352 22.9022 8.10352 22.8348C8.10352 22.6832 8.13314 22.5442 8.19238 22.4179C8.25163 22.2915 8.36588 22.1442 8.53516 21.9757C8.95834 21.5546 9.2207 21.0661 9.32227 20.5102C9.42383 19.9543 9.33919 19.4069 9.06836 18.8678C8.84831 18.3288 8.49707 17.9035 8.01465 17.5918C7.53222 17.2802 7.02018 17.1244 6.47852 17.1244H6.25C5.92838 17.1244 5.66602 17.0275 5.46289 16.8338C5.25977 16.6401 5.1582 16.3832 5.1582 16.0632C5.1582 15.7263 5.25977 15.461 5.46289 15.2673C5.66602 15.0735 5.92838 14.9767 6.25 14.9767H6.35156C6.94401 14.9767 7.47298 14.804 7.93848 14.4587C8.40397 14.1134 8.74674 13.6712 8.9668 13.1322C9.16992 12.5931 9.2207 12.0415 9.11914 11.4772C9.01758 10.9129 8.74675 10.3865 8.30664 9.89796C8.08659 9.69582 7.97656 9.44736 7.97656 9.15258C7.97656 8.85779 8.08659 8.60933 8.30664 8.40719C8.52669 8.18821 8.78483 8.08293 9.08105 8.09135C9.37728 8.09977 9.66081 8.23874 9.93164 8.50826C10.304 8.87885 10.7611 9.11889 11.3027 9.22838C11.8444 9.33787 12.3607 9.31681 12.8516 9.16521L13.1816 9.03887C13.7233 8.81989 14.1465 8.47036 14.4512 7.99028C14.7559 7.5102 14.9082 7.00065 14.9082 6.46161V6.23421C14.9082 5.91416 15.0098 5.65727 15.2129 5.46356C15.416 5.26984 15.6784 5.17298 16 5.17298C16.3216 5.17298 16.584 5.27405 16.7871 5.47619C16.9902 5.67833 17.0918 5.97311 17.0918 6.36054C17.0918 6.95012 17.2441 7.4723 17.5488 7.92711C17.8535 8.38193 18.2767 8.71882 18.8184 8.9378C19.36 9.15679 19.9144 9.21153 20.4814 9.10204C21.0485 8.99255 21.5775 8.71882 22.0684 8.28086C22.1699 8.17979 22.2799 8.10398 22.3984 8.05345C22.5169 8.00292 22.6608 7.97765 22.8301 7.97765C22.9824 7.97765 23.1178 8.00292 23.2363 8.05345C23.3548 8.10398 23.4733 8.17979 23.5918 8.28086C23.7949 8.49984 23.8923 8.75672 23.8838 9.05151C23.8753 9.34629 23.7357 9.62844 23.4648 9.89796C23.0924 10.2854 22.8512 10.7486 22.7412 11.2877C22.6312 11.8267 22.6608 12.3405 22.8301 12.829L22.9316 13.1322C23.1517 13.6712 23.5029 14.0965 23.9854 14.4082C24.4678 14.7198 24.9798 14.8756 25.5215 14.8756H25.75C26.0716 14.8756 26.334 14.9725 26.5371 15.1662C26.7402 15.3599 26.8418 15.6168 26.8418 15.9368C26.8418 16.2737 26.736 16.539 26.5244 16.7327C26.3128 16.9265 26.0208 17.0233 25.6484 17.0233C25.056 17.0233 24.527 17.1749 24.0615 17.4781C23.596 17.7813 23.2533 18.2025 23.0332 18.7415C22.7624 19.2805 22.6947 19.8322 22.8301 20.3965C22.9655 20.9608 23.2533 21.4872 23.6934 21.9757Z"
              fill="#1C0606"
            />
          </svg>
        );

      case "metr_on":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.8779 7.02333L25.1829 4.67169C25.4703 4.15389 26.1055 3.97716 26.6018 4.27693C27.0981 4.5767 27.2675 5.23947 26.9802 5.75727L18.6539 20.7617C18.9714 21.211 19.159 21.7662 19.159 22.3673C19.159 23.863 17.9967 25.0756 16.563 25.0756C15.1293 25.0756 13.9671 23.863 13.9671 22.3673C13.9671 20.8715 15.1293 19.6589 16.563 19.6589C16.6623 19.6589 16.7602 19.6647 16.8566 19.676L21.9792 10.4448L21.7704 8.55651C21.6394 7.37213 20.6782 6.47834 19.5354 6.47834H13.5906C12.4479 6.47834 11.4866 7.37213 11.3556 8.55651L9.55844 24.8065C9.4043 26.2002 10.4487 27.4228 11.7934 27.4228H21.3326C22.6773 27.4228 23.7217 26.2002 23.5676 24.8065L22.7892 17.9506L24.8207 14.64L25.9745 24.5168C26.2947 27.4114 24.1255 29.9506 21.3326 29.9506H11.7934C9.00055 29.9506 6.83138 27.4113 7.15151 24.5168L8.94871 8.26677C9.22077 5.80689 11.2172 3.95056 13.5906 3.95056H19.5354C21.4884 3.95056 23.1862 5.20748 23.8779 7.02333Z"
              fill="#1C0606"
            />
          </svg>
        );

      case "music":
        return (
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.21466 3.52427L13.1649 0.957072C15.1508 0.315831 17.1848 1.78449 17.208 3.86429L17.2083 14.6292C17.2724 15.6138 16.4521 16.7074 15.1557 17.2499C13.6316 17.8877 12.0268 17.5222 11.5712 16.4336C11.1157 15.345 11.9819 13.9454 13.5059 13.3076C14.3371 12.9598 15.1923 12.9103 15.872 13.1138V4.48642L6.54684 7.73363V16.2604C6.61093 17.245 5.79056 18.3386 4.49423 18.8811C2.97015 19.5189 1.36532 19.1534 0.909738 18.0648C0.454161 16.9761 1.32036 15.5766 2.84444 14.9388C3.67562 14.591 4.53081 14.5415 5.21051 14.745V5.49548H5.21421L5.21466 3.52427Z"
              fill="#ECB390"
            />
          </svg>
        );

      case "song-play":
        return (
          <svg
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.381958 16.9297V1.07024C0.381958 0.464638 1.00666 0.0883359 1.50208 0.395506L14.2916 8.32522C14.7799 8.62798 14.7799 9.37194 14.2916 9.67469L1.50208 17.6044C1.00666 17.9116 0.381958 17.5353 0.381958 16.9297Z"
              fill="white"
            />
          </svg>
        );

      case "back":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.4086 4.39738C22.1059 5.00348 22.2001 6.08445 21.619 6.81178L14.2786 16L21.619 25.1882C22.2001 25.9156 22.1059 26.9965 21.4086 27.6026C20.7113 28.2087 19.675 28.1105 19.094 27.3831L10 16L19.094 4.61687C19.675 3.88954 20.7113 3.79127 21.4086 4.39738Z"
              fill="#1C0606"
            />
          </svg>
        );

      default:
        return <div>No Icon</div>;
    }
  }
)`
  &.disabled {
    color: rgba(179, 179, 179, 0.3);
    fill: rgba(198, 198, 198, 0.3);
  }
`;
