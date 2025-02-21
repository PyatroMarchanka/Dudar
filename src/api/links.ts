const authLinks = {
  login: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/google`,
  loginServer: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/google-auth`,
  logout: `${process.env.REACT_APP_BACKEND_URL}/v1/auth/logout`,
  profile: `${process.env.REACT_APP_BACKEND_URL}/v1/profile`,
  updateSettings: `${process.env.REACT_APP_BACKEND_URL}/v1/settings-update`

}
const songsLinks = {
  songs: `${process.env.REACT_APP_BACKEND_URL}/v1/songs`,
  song: `${process.env.REACT_APP_BACKEND_URL}/v1/song`,
  songViews: `${process.env.REACT_APP_BACKEND_URL}/v1/songs/plays`
}

const playlistsLinks = {
  playlists: `${process.env.REACT_APP_BACKEND_URL}/v1/playlists`,
  playlist: `${process.env.REACT_APP_BACKEND_URL}/v1/playlists/:id`
  
}

const adminLinks = {
  adminSong: `${process.env.REACT_APP_BACKEND_URL}/v1/admin/song`
}

export const links = {
  ...authLinks,
  ...songsLinks,
  ...adminLinks,
  ...playlistsLinks
}