import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
import SearchBar from '../../Components/SearchBar';
import React, { useEffect, useState } from 'react';
import PlaylistForm from '../../Components/PlaylistForm';

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
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [playlistInfo, setPlaylistInfo] = useState({
    "name": "",
    "description": ""
  });

  const getReturnSpotifyAuth = (hash) => {
    const stringAfterHash = hash.substring(1);
    const urlParams = stringAfterHash.split("&");
    const paramSplitUp = urlParams.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    setAuthToken(paramSplitUp.access_token);
    setIsAuthorize(true);
  };
  
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const handleInput = (e) => {
    setSearchKey(e.target.value);
  };

  const handleFormPlaylist = (e) => {
    const { name, value } = e.target;
    setPlaylistInfo({...playlistInfo, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const url = "https://api.spotify.com/v1/search";
    const keywords = searchKey;
    const type = "track";
    try {
      const response = await fetch(`${url}?q=${keywords}&type=${type}&limit=10`, {
        headers: {
          'Authorization' : 'Bearer ' + authToken
        }
      });
      
      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error(`Unauthorized access, please login first`);
          case 403:
            throw new Error(`Forbidden access`);
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const musicData = await response.json()
        setMusicData(musicData.tracks.items);
      }
    } catch (error) {
      alert(`There has been a problem with your fetch operation: ${error.message}`);
    }
  };

  const fetchProfile = async () => {
    const url = "https://api.spotify.com/v1/me";
    try {
      const response = await fetch(`${url}`, {
        headers: {
          'Authorization' : 'Bearer ' + authToken
        }
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error(`Unauthorized access, please login first`);
          case 403:
            throw new Error(`Forbidden access`);
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const userData = await response.json()
        return userData.id;
      }
    } catch (error) {
      alert(`There has been a problem with your fetch operation: ${error.message}`);
    }
  };

  const createPlaylist = async (userID) => {
    const url = "https://api.spotify.com/v1/users/";
    const playlistParam = {
      ...playlistInfo,
      'public': false,
      'collaborative': false
    }
    try {
      const response = await fetch(`${url}${userID}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization' : 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistParam)
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error(`Unauthorized access, please login first`);
          case 403:
            throw new Error(`Forbidden access`);
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const playlistData = await response.json()
        return playlistData.id;
      }
    } catch (error) {
      alert(`There has been a problem with your post data operation: ${error.message}`);
    }
  };

  const addItemsToPlaylist = async (playlistId) => {
    const url = "https://api.spotify.com/v1/playlists/";
    const tracksParam = {'uris': selectedMusic}
    try {
      const response = await fetch(`${url}${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization' : 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tracksParam)
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error(`Unauthorized access, please login first`);
          case 403:
            throw new Error(`Forbidden access`);
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const addedTracks = await response.json()
        return addedTracks;
      }
    } catch (error) {
      alert(`There has been a problem with your post data operation: ${error.message}`);
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    const userId = await fetchProfile();
    const playlistId = await createPlaylist(userId);
    const snapshotId = await addItemsToPlaylist(playlistId);
    alert(`Yout playlist has been added\nSnapshot: ${snapshotId.snapshot_id}`)
  };

  const selectMusic = (data) => {
    const tempArrMusicId = [...selectedMusic, data.uri];
    setSelectedMusic(tempArrMusicId);
  };

  const deselectMusic = (data) => {
    const index = selectedMusic.indexOf(data.uri);

    const tempArrMusicId = selectedMusic.concat([]);
    tempArrMusicId.splice(index, 1);
    setSelectedMusic(tempArrMusicId);
  };

  useEffect(() => {
    if (window.location.hash) {
      getReturnSpotifyAuth(window.location.hash);
    }
  }, []);

  useEffect(() => {

  })

  return (
    <div className="App">
      <h1>Create your own playlist</h1>
      <button onClick={handleLogin}>Login to Spotify</button>
      <PlaylistForm handleFormPlaylist={handleFormPlaylist} handleCreatePlaylist={handleCreatePlaylist}/>
      <h3>Search and select your tracks first, before saving the playlist.</h3>
      <SearchBar handleInput={handleInput} handleSearch={handleSearch}/>
      {!isAuthorize && 
        <><p>You need to login to access this feature</p></>
      }
      <div className='musics-wrapper'>
        {
          musicData
          .filter((music) => {
            return selectedMusic.includes(music.uri);
          })
          .map((music) => {
            return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={true}/>
          })
        }
        {
          musicData
          .filter((music) => {
            return !selectedMusic.includes(music.uri);
          })
          .map((music) => {
            return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={false}/>
          })
        }
      </div>
    </div>
  );
}

export default App;
