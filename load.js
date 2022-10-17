console.log("Make MIDI Catalog...");

const folders = [
  { path: "./public/midi/Belarussian", label: "Belarussian" },
  { path: "./public/midi/Irish", label: "Irish" },
  { path: "./public/midi/Medieval", label: "Medieval" },
  { path: "./public/midi/Schotland", label: "Schotland" },
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
