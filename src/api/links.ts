export const links = {
  login: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`,
  loginServer: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/google-auth`,
  logout: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/logout`,
  profile: `${process.env.REACT_APP_BACKEND_URL}/v1/profile`,
  updateSettings: `${process.env.REACT_APP_BACKEND_URL}/v1/settings-update`,
  songs: `${process.env.REACT_APP_BACKEND_URL}/v1/songs`,
  songsShort: `${process.env.REACT_APP_BACKEND_URL}/v1/songs/short/names`,
};
