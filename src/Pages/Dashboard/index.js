import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
import data from './data';

function App() {
  return (
    <div className="App">
      <div className='musics-wrapper'>
        <h1>Your Playlist</h1>
        <Music url={data.album.images[0].url} title={data.name} artist={data.artists[0].name}/>
        <Music url={data.album.images[0].url} title={data.name} artist={data.artists[0].name}/>
        <Music url={data.album.images[0].url} title={data.name} artist={data.artists[0].name}/>
        <Music url={data.album.images[0].url} title={data.name} artist={data.artists[0].name}/>
      </div>
    </div>
  );
}

export default App;
