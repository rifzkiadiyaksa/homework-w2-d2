import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
import SearchBar from '../../Components/SearchBar';
// import data from './data';
import React, { useState } from 'react';
import PlaylistForm from '../../Components/PlaylistForm';
import { useSelector } from 'react-redux';
import {
  Redirect
} from "react-router-dom";

function CreatePlaylist() {

  const [searchKey, setSearchKey] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const { token } = useSelector((state) => state.userToken);

  const handleInput = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const url = "https://api.spotify.com/v1/search";
    const keywords = searchKey;
    const type = "track";
    console.log(token);
    try {
      const response = await fetch(`${url}?q=${keywords}&type=${type}&limit=10`, {
        headers: {
          'Authorization' : 'Bearer ' + token
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

  return (
    <div className="App">
      {
          token === "" ? <Redirect to="/"/> : <p>You're Logged in</p> 
      }
      <h1>Create your own playlist</h1>

      <PlaylistForm selectedMusic={selectedMusic} />

      <h3>Search and select your tracks first, before saving the playlist.</h3>

      <SearchBar handleInput={handleInput} handleSearch={handleSearch}/>

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

export default CreatePlaylist;
