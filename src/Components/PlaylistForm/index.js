import { useState } from 'react';
import { useSelector } from 'react-redux';
import '../../Assets/Styles/PlaylistForm.css';

function PlaylistForm ({selectedMusic}) {
    const { token } = useSelector((state) => state.userToken);
    const [playlistInfo, setPlaylistInfo] = useState({
        "name": "",
        "description": ""
    });
    
    const handleFormPlaylist = (e) => {
        const { name, value } = e.target;
        setPlaylistInfo({...playlistInfo, [name]: value });
    };
    
    const fetchProfile = async () => {
        const url = "https://api.spotify.com/v1/me";
        try {
            const response = await fetch(`${url}`, {
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
                const userData = await response.json();
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
                    'Authorization' : 'Bearer ' + token,
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
                const playlistData = await response.json();
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
                    'Authorization' : 'Bearer ' + token,
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
                const addedTracks = await response.json();
                return addedTracks;
            }
        } catch (error) {
            alert(`There has been a problem with your post data operation: ${error.message}`);
        }
    }
    
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        const userId = await fetchProfile(token);
        const playlistId = await createPlaylist(userId);
        const snapshotId = await addItemsToPlaylist(playlistId);
        alert(`Yout playlist has been added\nSnapshot: ${snapshotId.snapshot_id}`)
    };
    
    return (
        <>
        <form className='playlist-form' action="" onSubmit={handleCreatePlaylist}>
            <label htmlFor="input-name">Playlist Name</label>
            <input id='input-name' className='input text' onChange={handleFormPlaylist} type="text" name="name" required/>
            <label htmlFor="input-desc">Playlist Description</label>
            <textarea id='input-desc' className='input textarea' onChange={handleFormPlaylist} type="textarea" name="description" minLength={10} required/>
            <input className='input submit' type="submit" value="Save Playlist" />
        </form>
        </>
    );
}

export default PlaylistForm;