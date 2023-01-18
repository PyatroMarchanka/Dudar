console.log("Make MIDI Catalog...");

const folders = [
  { path: "./public/midi/newSongFormat", label: "New Song Format" },
  // { path: "./public/midi/irish", label: "irish" },
  // { path: "./public/midi/medieval", label: "medieval" },
  // { path: "./public/midi/schotland", label: "schotland" },
];
const fs = require("fs");

const checkSong = (song) => {
  if (
    !song.name ||
    !song.type ||
    !song.bagpipesToPlay ||
    !song.bagpipesToPlay.length ||
    !song.bagpipesToPlay[0] ||
    !song.timeSignature ||
    !song.pathName
  ) {
    console.error("Caugth an error parsing song name: ", song.pathName, song);
  }
};

const songs = [];
folders.forEach((folder) => {
  fs.readdirSync(folder.path).forEach((file) => {
    if (file.includes(".mid")) {
      const song = {};
      const props = file.split("|");
      song.name = props[0];
      song.type = props[1];
      song.bagpipesToPlay = props[2].split(",");
      song.timeSignature = props[3];
      song.pathName = file;

      checkSong(song);

      songs.push(song);
    }
  });
});

fs.writeFile(
  "./public/midi/list.json",
  JSON.stringify(songs),
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("MIDI Catalog file has been saved in list.json.");
  }
);
