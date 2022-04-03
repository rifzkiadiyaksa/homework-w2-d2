import '../../Assets/Styles/Music.css';

function Music({data, select, deselect, isSelected}) {

    const handleSelect = () => {
        select(data);
    }

    const handleDeselect = () => {
        deselect(data);
    }

    return (
        <div className='Music'>
            <div className='music-img'>
                <img src={data.album.images[0].url} alt={data.name}/>
            </div>
            <div className='music-info'>
                <p className='music-title'>{data.name}</p>
                <p className='music-artist'>{data.artists[0].name}</p>
            </div>
            <div>
                {isSelected
                    ? <button onClick={handleDeselect} className='btn selected'>Deselect</button>
                    : <button onClick={handleSelect} className='btn select'>Select</button>
                }
            </div>
        </div>
    );
}

export default Music;