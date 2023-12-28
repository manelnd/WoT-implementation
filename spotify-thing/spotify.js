const { Servient } = require("@node-wot/core");
const { HttpServer } = require("@node-wot/binding-http");
const { Hardware } = require("keysender");

const servient = new Servient();
const hardware = new Hardware(); // Now Hardware is defined

const httpServer = new HttpServer({ port: 4444 });
servient.addServer(httpServer);

servient.start().then(async (Wot) => {
  const spotify = await Wot.produce({
    "title": "SpotifyPlayer",
    "description": "a Spotify player",
    "actions": {
      "play-pause": {
        "description": "play or pause the local Spotify player",
      },
    },
  });

  spotify.setActionHandler("play-pause", () => {
    console.log("play-pause");
    hardware.keyboard.sendKey(0xB3);
  });

  await spotify.expose();
});
