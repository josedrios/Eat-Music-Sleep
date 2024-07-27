// Headers
const artistHeader = document.getElementById("artist-header");
const albumHeader = document.getElementById("album-header");
const songHeader = document.getElementById("song-header");

// Entries
const btn = document.getElementById("confirmation");
const songInput = document.getElementById("song-entry");

// Information Plugs
const lyrics = document.getElementById("lyrics");
const artistPhoto = document.getElementById("artist-photo");
const art = document.getElementById("artist-content");
const lyricsContent = document.getElementById("lyrics-content");
const alerter = document.getElementById("alerter");
const resultsContainer = document.getElementById("result-container");
const album = document.getElementById("album-photo");
const preview = document.getElementById("preview");
const showArtistInfo = document.getElementById("artist-info-name");

// Removing Refresh on Form Submission
btn.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        document.getElementById('confirmation').click();
    }
});

document.getElementById('confirmation').addEventListener('click', function(event) {
    event.preventDefault();
});

// API (INFORMATION RETRIEVAL)
btn.addEventListener('click', async (e) => {
    resultsContainer.innerHTML = '';
    lyrics.innerHTML = '';
    
    var song = songInput.value.trim();

    if(song === ''){
        alerter.classList.add("show");
        setTimeout(function(){
            alerter.classList.remove("show")
        }, 3500)
        return;
    }

    await fetch(`https://api.lyrics.ovh/suggest/${song}&fmt=json`)
        .then(response => response.json())
        .then(data => {
            
            if(data.data.length === 0){
                var newResult = document.createElement('div')
                newResult.classList.add("results-row")
                newResult.classList.add("no-results-found")
                newResult.innerHTML = "No Results Found"
                resultsContainer.appendChild(newResult);
                return
            }

            for(i=0; i< 5; i++){
                var currentArtist = data.data[i].artist.name;
                var currentSong = data.data[i].title;
                var currentImg = data.data[i].artist.picture;
                var newResult = document.createElement('div');

                newResult.classList.add("result-row");
                newResult.innerHTML =
                `<div class="result-row-info">
                    <img class="result-image" src="${currentImg}" alt="">
                    <div class="artist-song-info">
                        <div class="result-header">${currentArtist}</div>
                        <div class="result-header">${currentSong}</div>
                        <button class="find-lyrics-btn hide">View Lyrics</button>
                    </div>
                </div>
                <div class="result-btn-container">
                    <button class="find-lyrics-btn post-lyrics remove">View Lyrics</button>
                </div>`
                resultsContainer.appendChild(newResult);
            }

            var buttons = document.querySelectorAll('.post-lyrics');
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    populateLyrics(data, index)
                });
            });
        })
})

async function populateLyrics(data, index){
    var tempName = data.data[index].artist.name;
    var tempSong = data.data[index].title;
    var tempAlbum = data.data[index].album.title;
    var artistPic = data.data[index].artist.picture;
    var albumPic = data.data[index].album.cover;

    preview.setAttribute('src', data.data[index].preview);
    artistPhoto.setAttribute('src',`${artistPic}`);
    album.setAttribute('src', `${albumPic}`);

    await fetch(`https://api.lyrics.ovh/v1/${tempName}/${tempSong}`)
    .then(response => response.json())
    .then(data => {
        data.lyrics = removePrefix(data)
        console.log(data.lyrics)
        if(data['lyrics'] === undefined){
            lyrics.innerHTML = "No Lyrics Found"
            lyricsContent.classList.add("no-lyrics");
        }else{
            lyrics.innerHTML = data['lyrics']
        }
    })

    artistHeader.innerHTML = tempName;
    songHeader.innerHTML = tempSong;
    albumHeader.innerHTML = tempAlbum;

    if(lyrics.textContent.trim() !== ''){
        lyricsContent.classList.add("show");
        showArtistInfo.classList.add("show")
        art.classList.add("show")
    }    

    const jumpTo = document.getElementById('jump-destination');
    window.scrollTo({
        top: jumpTo.offsetTop,
        behavior: 'smooth'
    })
}

function removePrefix(data){
    if(data.lyrics.includes("Paroles de la chanson")){
        const lines = data.lyrics.split('\n');
        lines.shift();
        const newLyrics = lines.join('\n');
        return newLyrics
    }else{
        return data.lyrics
    }
}