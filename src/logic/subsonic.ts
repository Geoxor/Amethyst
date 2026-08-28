import { SubsonicAPI } from "subsonic-api";

const api = new SubsonicAPI({
  url: "https://demo.navidrome.org",
  auth: {
    username: "demo",
    password: "demo",
  },
});

const { randomSongs } = await api.getRandomSongs();
console.log(randomSongs);
