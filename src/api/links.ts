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
  songViews: `${process.env.REACT_APP_BACKEND_URL}/v1/songs/plays`,
  topSongs: `${process.env.REACT_APP_BACKEND_URL}/v1/songs/top/plays`,
  newSongs: `${process.env.REACT_APP_BACKEND_URL}/v1/songs/top/recent`
}

const playlistsLinks = {
  playlists: `${process.env.REACT_APP_BACKEND_URL}/v1/playlists`,
}

const adminLinks = {
  adminSong: `${process.env.REACT_APP_BACKEND_URL}/v1/admin/song`
}

const articleLinks = {
  article: `${process.env.REACT_APP_BACKEND_URL}/v1/articles`,
  categories: `${process.env.REACT_APP_BACKEND_URL}/v1/categories`,
}

export const links = {
  ...authLinks,
  ...songsLinks,
  ...adminLinks,
  ...playlistsLinks,
  ...articleLinks,
}