import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const EDuda = () => {
  const [bleState, setBleState] = useState("Disconnected");
  const [stroi, setStroi] = useState(
    localStorage.getItem("stroi") || "F#4,E4,D4,C#4,B3,A3,G3,E3,E3"
  );
  const [level, setLevel] = useState(10);
  const [progress, setProgress] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const bleServer = useRef<any>(null);
  const bleServiceFound = useRef<any>(null);
  const sensorCharacteristicFound = useRef(null);
  const synth = useRef(
    new Tone.Sampler({
      urls: {
        A2: "../samples/A2.mp3",
        "D#2": "../samples/D#2.mp3",
        A3: "../samples/A3.mp3",
        C4: "../samples/C4.mp3",
        E4: "../samples/E4.mp3",
        A4: "../samples/A4.mp3",
      },
      baseUrl: "/",
    }).toDestination()
  );
  const droneSynth = useRef(
    new Tone.Sampler({
      urls: {
        A2: "../samples/A2.mp3",
        "D#2": "../samples/D#2.mp3",
        A3: "../samples/A3.mp3",
        C4: "../samples/C4.mp3",
        E4: "../samples/E4.mp3",
        A4: "../samples/A4.mp3",
      },
      baseUrl: "/",
    }).toDestination()
  );

  useEffect(() => {
    localStorage.setItem("stroi", stroi);
  }, [stroi]);

  const handleConnect = async () => {
    if (!(navigator as any).bluetooth) {
      setBleState("Web Bluetooth API is not available");
      return;
    }

    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: "eDuda" }],
        optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"],
      });

      setBleState(`Connected to device ${device.name}`);
      device.addEventListener("gattservicedisconnected", handleDisconnect);

      const gattServer = await device.gatt.connect();
      bleServer.current = gattServer;

      const service = await gattServer.getPrimaryService(
        "19b10000-e8f2-537e-4f6c-d104768a1214"
      );
      bleServiceFound.current = service;

      const characteristic = await service.getCharacteristic(
        "19b10001-e8f2-537e-4f6c-d104768a1214"
      );
      sensorCharacteristicFound.current = characteristic;

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicChange
      );
      await characteristic.startNotifications();
      setBleState("Notifications started");
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    if (bleServer.current) {
      bleServer.current.disconnect();
      setBleState("Disconnected");
    }
  };

  const handleCharacteristicChange = (event: any) => {
    const newValue = new TextDecoder().decode(event.target.value);
    const now = Tone.now();
    let noteToPlay = stroi.split(",")[0];

    if (newValue === "111111111") {
      noteToPlay = stroi.split(",").slice(-1)[0];
    } else {
      stroi.split(",").some((note, index) => {
        if (newValue[index + 1] === "0") {
          noteToPlay = note;
          return true;
        }
        return false;
      });
    }

    setCurrentNote(noteToPlay);

    if (newValue === "111111111" || newValue === "111111110") {
      setIsSoundEnabled(true);
    } else if (
      newValue === "000000000" ||
      (isSoundEnabled && newValue[0] === "0")
    ) {
      setIsSoundEnabled(false);
      synth.current.releaseAll();
      droneSynth.current.releaseAll();
      return;
    }

    if (!isSoundEnabled) return;

    droneSynth.current.triggerRelease("A2", now);
    droneSynth.current.triggerAttack("A2", now);
    synth.current.triggerRelease(currentNote);
    synth.current.triggerAttack(noteToPlay, now);
  };

  const handleUpdate = async (file: any) => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const chunkSize = 512;

    try {
      const ota = await bleServiceFound?.current?.getCharacteristic(
        "19b10003-e8f2-537e-4f6c-d104768a1214"
      );
      for (let i = 0; i < Math.ceil(data.byteLength / chunkSize); i++) {
        setProgress(
          `Uploaded ${Math.ceil((100 * (i * chunkSize)) / data.byteLength)}%`
        );
        const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
        await ota.writeValue(chunk);
      }
      setProgress("Update complete. Device will restart.");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div>
      <div className="topnav">
        <h1>eDuda</h1>
      </div>
      <div className="content">
        <div className="card-grid">
          <div className="card">
            <button onClick={handleConnect} className="connectButton">
              Connect
            </button>
            <button onClick={handleDisconnect} className="disconnectButton">
              Disconnect
            </button>
            <input
              type="file"
              accept=".bin"
              onChange={(e) => handleUpdate(e.target.files?.[0])}
            />
            <span>{progress}</span>
            <p>
              eDuda state:{" "}
              <strong
                style={{
                  color: bleState === "Disconnected" ? "#d13a30" : "#24af37",
                }}
              >
                {bleState}
              </strong>
            </p>
          </div>
        </div>

        <div className="card-grid">
          <div className="card">
            <h2>NOTE</h2>
            <p
              className="reading"
              style={{ fontSize: "32px", color: "green", fontWeight: "bold" }}
            >
              {currentNote}
            </p>
          </div>
          <div className="card">
            <h2>STROI</h2>
            <input
              type="text"
              value={stroi}
              onChange={(e) => setStroi(e.target.value)}
              style={{ width: "300px" }}
            />
            <p>
              <button onClick={() => setStroi("F4,E4,D4,C4,B3,A3,G3,E3,E3")}>
                F4,E4,D4,C4,B3,A3,G3,E3,E3
              </button>
            </p>
            <p>
              <button onClick={() => setStroi("F#4,E4,D4,C#4,B3,A3,G3,E3,E3")}>
                F#4,E4,D4,C#4,B3,A3,G3,E3,E3
              </button>
            </p>
          </div>
          <div className="card">
            <h2>Settings</h2>
            <label>LEVEL</label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              style={{ width: "500px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDuda;
