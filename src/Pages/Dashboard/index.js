import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
// import SearchBar from '../../Components/SearchBar';
// import data from './data';
import React, { useEffect, useState } from 'react';

// console.log(process.env.REACT_APP_CLIENT_ID);
// console.log(process.env.REACT_APP_CLIENT_SECRET);

// https://accounts.spotify.com/authorize?response_type=token&client_id=&scope=&redirect_uri=&state=

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-private", "user-read-private"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

function App() {

  const [authToken, setAuthToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [isDataExist, setisDataExist] = useState(false);

  const getReturnSpotifyAuth = (hash) => {
    const stringAfterHash = hash.substring(1);
    const urlParams = stringAfterHash.split("&");
    const paramSplitUp = urlParams.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    setAuthToken(paramSplitUp.access_token);
  }
  
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  }

  const handleInput = (e) => {
    setSearchKey(e.target.value);
  }

  const handleSearch = () => {
    const url = "https://api.spotify.com/v1/search";
    const keywords = searchKey;
    const type = "track";
    fetch(`${url}?q=${keywords}&type=${type}&limit=10`, {
      headers: {
        'Authorization' : 'Bearer ' + authToken
      }
    })
    .then(response => response.json())
    .then(data => {
      setMusicData(data.tracks.items);
      setisDataExist(true);
    });
  }

  useEffect(() => {
    if (window.location.hash) {
      getReturnSpotifyAuth(window.location.hash);
    }
  });

  return (
    <div className="App">
      <h1>Search your Track</h1>
      <button onClick={handleLogin}>Login to Spotify</button>
      <div className='SearchBar'>
          <input onChange={handleInput} type="text" />
          <input onClick={handleSearch} type="submit" value="Search" />
      </div>
      <div className='musics-wrapper'>
        {isDataExist &&
          musicData.map((music) => {
            return <Music key={music.id} url={music.album.images[0].url} title={music.name} artist={music.artists[0].name}/>
          })
        }
      </div>
    </div>
  );
}

export default App;
