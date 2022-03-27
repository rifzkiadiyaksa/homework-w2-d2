import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
import data from './data';

function App() {
  return (
    <div className="App">
      <div className='musics-wrapper'>
        <h1>Your Playlist</h1>
        {
          data.map((music) => {
            return <Music key={music.id} url={music.album.images[0].url} title={music.name} artist={music.artists[0].name}/>
          })
        }
      </div>
    </div>
  );
}

export default App;