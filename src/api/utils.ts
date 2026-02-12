import cookie from "react-cookies";

export const withAuth = () => ({
    headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
    },
    withCredentials: true,
})