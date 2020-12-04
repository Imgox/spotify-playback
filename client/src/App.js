import "./App.css";
import { useState, useEffect } from "react";
import Spotify from "spotify-web-api-js";

const spotifyWepApi = new Spotify();

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const params = getHashParams();

if (params.access_token) {
  spotifyWepApi.setAccessToken(params.access_token);
}

function App() {
  const loggedIn = useState(params.access_token ? true : false)[0];
  const [nowPlaying, setNowPlaying] = useState({
    song: "Not checked",
    img: "",
  });
  const [isplaying, setIsplaying] = useState(false);

  useEffect(() => {
    spotifyWepApi
      .getMyCurrentPlaybackState()
      .then((response) => {
        setNowPlaying({
          song: response.item ? response.item.name : "nothing is playing",
          img: response.item ? response.item.album.images[1].url : "",
        });
        setIsplaying(response.is_playing ? response.is_playing : false);
        document.querySelector(
          ".bg"
        ).style.backgroundImage = `url('${response.item.album.images[0].url}')`;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="App">
      <div className="bg"></div>
      <a
        href="http://localhost:8888/login"
        style={{ display: loggedIn ? "none" : "block" }}
      >
        <button>Login to spotify</button>
      </a>
      <div style={{ display: loggedIn ? "block" : "none" }}>
        <img src={nowPlaying.img} alt="" />
        <h3>{nowPlaying.song}</h3>

        <div>
          <i
            id="playPause"
            className={isplaying ? "fas fa-pause" : "fas fa-play"}
            onClick={() => {
              if (isplaying) {
                spotifyWepApi
                  .pause()
                  .then(() => {
                    setIsplaying(false);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                spotifyWepApi
                  .play()
                  .then((response) => {
                    setIsplaying(true);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default App;
