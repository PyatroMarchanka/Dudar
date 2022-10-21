console.log("Make MIDI Catalog...");

const folders = [
  { path: "./public/midi/belarussian", label: "belarussian" },
  { path: "./public/midi/irish", label: "irish" },
  { path: "./public/midi/medieval", label: "medieval" },
  { path: "./public/midi/schotland", label: "schotland" },
];
const fs = require("fs");

const list = {};

folders.forEach((folder) => {
  const fileNames = [];
  fs.readdirSync(folder.path).forEach((file) => {
    fileNames.push(file);
  });
  list[folder.label] = fileNames;
});

fs.writeFile(
  "./public/midi/list.json",
  JSON.stringify(list),
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("MIDI Catalog file has been saved in list.json.");
  }
);
