const bagpipes = {
  bd: {
    name: "belTradDuda",
    type: "bd",
    notesMap: {
      E4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6, 8, 9],
      B4: [0, 1, 2, 3, 4, 5, 7, 8, 9],
      C5: [0, 1, 2, 3, 4, 6, 7, 8, 9],
      "C#5": [0, 1, 2, 3, 6, 7, 8, 9],
      D5: [0, 1, 2, 4, 5, 6, 7, 8, 9],
      E5: [0, 1, 3, 4, 5, 6, 7, 8, 9],
      F5: [0, 2, 3, 4, 5, 6, 7, 8, 9],
      "F#5": [2, 3, 4, 5, 6, 7, 8, 9],
    },
    holesPositions: {
      closable: [
        { yPos: 100, leftMargin: 4, diameter: 13.600000000000001 },
        { yPos: 116, leftMargin: 4, diameter: 13.600000000000001 },
        { yPos: 142.4, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 196, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 243.20000000000002, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 259.2, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 292.8, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 346.40000000000003, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 403.20000000000005, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 419.20000000000005, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
      ],
      linesYPositions: [
        115.60000000000001, 156.4, 210, 258.8, 306.8, 360.40000000000003, 418.8, 456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: -21.6,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 44,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
    },
    notesToLines: {
      E4: 7,
      G4: 6,
      "G#4": 6,
      A4: 5,
      B4: 4,
      C5: 3,
      "C#5": 3,
      D5: 2,
      E5: 1,
      F5: 0,
      "F#5": 0,
    },
    fingersMaps: {
      E4: [0, 1, 2, 3, 4, 5, 6],
      G4: [0, 1, 2, 3, 4, 5],
      "G#4": [0, 1, 2, 3, 4, 5],
      A4: [0, 1, 2, 3, 4, 6],
      B4: [0, 1, 2, 3, 5, 6],
      C5: [0, 1, 2, 4, 5, 6],
      "C#5": [0, 1, 2, 4, 5, 6],
      D5: [0, 1, 3, 4, 5, 6],
      E5: [0, 2, 3, 4, 5, 6],
      F5: [1, 2, 3, 4, 5, 6],
      "F#5": [1, 2, 3, 4, 5, 6],
    },
  },
  bnd: {
    name: "belNonTradDuda",
    type: "bnd",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      A4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      B4: [0, 1, 2, 3, 4, 5, 6, 7],
      C5: [0, 1, 2, 3, 4, 5, 6, 8],
      "C#5": [0, 1, 2, 3, 4, 5, 8],
      D5: [0, 1, 2, 3, 4, 6, 7, 8],
      E5: [0, 1, 2, 3, 5, 6, 7, 8],
      F5: [0, 1, 2, 4, 5, 6, 7, 8],
      "F#5": [0, 1, 4, 5, 6, 7, 8],
      G5: [0, 2, 3, 4, 5, 6, 7, 8],
      A5: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    holesPositions: {
      closable: [
        { yPos: 96, leftMargin: -4.800000000000001, diameter: 28 },
        { yPos: 116.80000000000001, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 161.60000000000002, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 177.60000000000002, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 206.4, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 249.60000000000002, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 292, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 309.6, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 336, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 380, leftMargin: 54.400000000000006, diameter: 28 },
      ],
      linesYPositions: [110, 130.8, 177.20000000000002, 220.4, 263.6, 307.6, 350, 394, 456],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: -21.6,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 44,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      "G#4": 8,
      A4: 7,
      B4: 6,
      C5: 5,
      "C#5": 5,
      D5: 4,
      E5: 3,
      F5: 2,
      "F#5": 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4, 6],
      "C#5": [0, 1, 2, 3, 4, 6],
      D5: [0, 1, 2, 3, 5, 6],
      E5: [0, 1, 2, 4, 5, 6],
      F5: [0, 1, 3, 4, 5, 6],
      "F#5": [0, 1, 3, 4, 5, 6],
      G5: [0, 2, 3, 4, 5, 6],
      A5: [1, 2, 3, 4, 5, 6],
    },
  },
  bod: {
    name: "belOpenDuda",
    type: "bod",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      A4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      B4: [0, 1, 2, 3, 4, 5, 6, 7],
      C5: [0, 1, 2, 3, 4, 5, 6],
      "C#5": [0, 1, 2, 3, 4, 5],
      D5: [0, 1, 2, 3, 4],
      E5: [0, 1, 2, 3],
      F5: [0, 1, 2],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
    holesPositions: {
      closable: [
        { yPos: 136, leftMargin: -4.800000000000001, diameter: 28 },
        { yPos: 156.8, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 201.60000000000002, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 217.60000000000002, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 246.4, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 289.6, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 332, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 349.6, leftMargin: 58.400000000000006, diameter: 13.600000000000001 },
        { yPos: 376, leftMargin: 54.400000000000006, diameter: 28 },
        { yPos: 420, leftMargin: 54.400000000000006, diameter: 28 },
      ],
      blowImage: { yPos: 92, leftMargin: 25.6, diameter: 24 },
      linesYPositions: [
        150, 170.8, 217.20000000000002, 260.40000000000003, 303.6, 347.6, 390, 434, 456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: 20,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 44,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      "G#4": 8,
      A4: 7,
      B4: 6,
      C5: 5,
      "C#5": 5,
      D5: 4,
      E5: 3,
      F5: 2,
      "F#5": 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      "C#5": [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
  },
  ddl: {
    name: "dudelsack",
    type: "ddl",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      G5: [0],
      A5: [],
    },
    holesPositions: {
      closable: [
        { yPos: 112, leftMargin: 16, diameter: 20 },
        { yPos: 148.8, leftMargin: 40, diameter: 20 },
        { yPos: 209.60000000000002, leftMargin: 42.400000000000006, diameter: 16 },
        { yPos: 262.40000000000003, leftMargin: 40, diameter: 20 },
        { yPos: 348.8, leftMargin: 40, diameter: 20 },
        { yPos: 393.6, leftMargin: 42.400000000000006, diameter: 16 },
        { yPos: 454.40000000000003, leftMargin: 40, diameter: 20 },
        { yPos: 496, leftMargin: 40, diameter: 20 },
      ],
      blowImage: { yPos: 72, leftMargin: 36, diameter: 26.400000000000002 },
      linesYPositions: [
        72, 122, 158.8, 217.60000000000002, 272.40000000000003, 358.8, 401.6, 464.40000000000003,
        506,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 160,
        heigth: 716.8000000000001,
        imageScale: 0.2232142857142857,
        leftMargin: -30.400000000000002,
        topMargin: 0,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 44,
        notesNamesLeftMargin: 4,
        noteNameColor: "#000",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
    },
    notesToLines: { G4: 8, A4: 7, B4: 6, C5: 5, D5: 4, E5: 3, F5: 2, G5: 1, A5: 0 },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      G5: [0],
      A5: [],
    },
  },
};

const getSongNotesWithOctaveFromMidi = (midi: any) => {
  const notes = midi?.tracks.filter((track: any) => track.notes.length)[0].notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note: any) => {
    const noteWthOctave = note.pitch + note.octave;
    if (!(noteWthOctave in notesObject)) {
      notesObject[noteWthOctave] = noteWthOctave;
    }
  });

  return Object.keys(notesObject);
};

const bagpipeNotesMaps = Object.values(["bd", "bnd", "bod", "ddl"]).map((bagpipeType) => ({
  bagpipeNotes: Object.keys(bagpipes[bagpipeType].notesMap),
  bagpipeType,
}));

const findBagpipesForSong = (midi: any) => {
  const songNotesFromMidi = getSongNotesWithOctaveFromMidi(midi);
  const filteredBagpipesForSong = bagpipeNotesMaps.filter(
    ({ bagpipeNotes }) => !songNotesFromMidi.filter((note) => !bagpipeNotes.includes(note)).length
  );

  const bagpipesForSong = filteredBagpipesForSong.map(({ bagpipeType }) => bagpipeType);

  return bagpipesForSong;
};

const getSongListWithBagpipeTypes = async (songs: any): Promise<any[]> => {
  const nodeFetch = require("node-fetch");

  const songList = songs;
  let updatedSongList: any[] = [];

  try {
    updatedSongList = await Promise.all(
      songList.map(async (song: any) => {
        const file = await nodeFetch(`http://localhost:3000/midi/${song.pathName}`);
        const buffer = await file.arrayBuffer();
        const { Midi } = require("@tonejs/midi");

        const midi = new Midi(buffer);
        const bagpipesToPlay = findBagpipesForSong(midi);

        return { ...song, bagpipesToPlay };
      })
    );
  } catch (error: any) {
    console.log(error);
  }

  return updatedSongList;
};

const folders = [
  { path: "./public/midi/belarusian", label: "Belarusian" },
  { path: "./public/midi/irish", label: "Irish" },
  { path: "./public/midi/medieval", label: "Medieval" },
  { path: "./public/midi/balkan", label: "Balkan" },
  { path: "./public/midi/schotland", label: "Schotland" },
  { path: "./public/midi/other", label: "Other" },
];

const initSongList = async () => {
  const fs = require("fs");

  const songs: any[] = [];
  folders.forEach((folder) => {
    fs.readdirSync(folder.path).forEach((file: string) => {
      if (file.includes(".mid")) {
        const song = {} as any;
        const nameWOutExt = file.split(".mid").join("");
        const name = nameWOutExt.split("|")[0].split("$")[0];
        const timeSignature = nameWOutExt.split("|")[1];
        song.labels = nameWOutExt.split("$")[1].split("-");
        song.timeSignature = timeSignature?.split("-").join("/") || "4/4";
        song.name = name.split("-trad").join("");
        song.type = folder.label.toLowerCase();
        song.pathName = `${folder.path.split("./public/midi/").join("")}/${file}`;

        songs.push(song);
      }
    });
  });

  const songsWithBagpipes = await getSongListWithBagpipeTypes(songs);

  fs.writeFile(
    "./public/midi/list.json",
    JSON.stringify(songsWithBagpipes),
    "utf8",
    function (err: any) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("MIDI Catalog file has been saved in list.json.");
    }
  );
};

initSongList();
