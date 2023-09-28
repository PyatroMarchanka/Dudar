const folders = [
  { path: "./public/midi/belarusian", label: "Belarusian" },
  { path: "./public/midi/irish", label: "Irish" },
  { path: "./public/midi/medieval", label: "Medieval" },
  { path: "./public/midi/balkan", label: "Balkan" },
  { path: "./public/midi/schotland", label: "Schotland" },
];
const fs = require("fs");

const songs = [];
folders.forEach((folder) => {
  fs.readdirSync(folder.path).forEach((file) => {
    if (file.includes(".mid")) {
      const song = {};
      const [name, timeSignature] = file.split(".mid").join("").split("|");
      song.timeSignature = timeSignature?.split("-").join("/") || "4/4";
      song.name = name.split('-trad').join('');
      song.type = folder.label.toLowerCase();
      song.pathName = `${folder.path.split("./public/midi/").join("")}/${file}`;

      songs.push(song);
    }
  });
});

fs.writeFile("./public/midi/list.json", JSON.stringify(songs), "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("MIDI Catalog file has been saved in list.json.");
});
