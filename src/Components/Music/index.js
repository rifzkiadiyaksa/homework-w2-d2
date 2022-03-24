import '../../Assets/Styles/Music.css';

function Music({url, title, artist}) {
    return (
        <div className='Music'>
            <div className='music-img'>
                <img src={url} alt={title}/>
            </div>
            <div className='music-info'>
                <p className='music-title'>{title}</p>
                <p className='music-artist'>{artist}</p>
            </div>
            <div>
                <button className='btn select'>Select</button>
            </div>
        </div>
    );
}

export default Music;