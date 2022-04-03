import '../../Assets/Styles/PlaylistForm.css';

function PlaylistForm ({handleCreatePlaylist, handleFormPlaylist}) {
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