const songInput = document.getElementById("song-entry");
const lyrics = document.getElementById("lyrics");
const btn = document.getElementById("confirmation");
const artistPhoto = document.getElementById("artist-photo");
const artistHeader = document.getElementById("artist-header");
const albumHeader = document.getElementById("album-header");
const songHeader = document.getElementById("song-header");
const art = document.getElementById("artist-content");
const lyricsContent = document.getElementById("lyrics-content");
const alerter = document.getElementById("empty-song");
const resultsContainer = document.getElementById("result-container");
const duration = document.getElementById("duration");
const album = document.getElementById("album-photo");
const preview = document.getElementById("preview");
const tester = document.getElementById("artist-heading")

// Form Submission Efficiency
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
    var song = songInput.value.trim();
    await fetch(`https://api.lyrics.ovh/suggest/${song}&fmt=json`)
        .then(response => response.json())
        .then(data => {
            let resultsLength = JSON.parse(data['data'].length);

            if(resultsLength === 0){
                console.log("No Results Found")
            }

            for(i=0; i< 5; i++){
                var currentArtist = data.data[i].artist.name;
                var currentSong = data.data[i].title;
                var currentImg = data.data[i].artist.picture;
                var adding = document.createElement('div');

                adding.classList.add("result-row");
                adding.innerHTML =`
                    <div class="result-row-info">
                        <img class="result-image" src="${currentImg}" alt="">
                        <div class="artist-song-info">
                            <div class="artist-result result-header">${currentArtist}</div>
                            <div class="song-result result-header">${currentSong}</div>
                        </div>
                    </div>
                    <div class="lyrics-btn-container">
                        <button class="find-lyrics-btn id=button-test">View Lyrics</button>
                    </div>`
                resultsContainer.appendChild(adding);
            }

            var buttons = document.querySelectorAll('.find-lyrics-btn');
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    populateLyrics(data, index)
                });
            });
            
        })
})

function populateLyrics(data, index){
    var tempName = data.data[index].artist.name;
    var tempSong = data.data[index].title;
    var tempAlbum = data.data[index].album.title;
    var artistPic = data.data[index].artist.picture;
    var albumPic = data.data[index].album.cover;
    preview.setAttribute('src', data.data[index].preview);
    
    artistPhoto.setAttribute('src',`${artistPic}`);
    album.setAttribute('src', `${albumPic}`);


    fetch(`https://api.lyrics.ovh/v1/${tempName}/${tempSong}`)
    .then(response => response.json())
    .then(data => {
        if(data['lyrics'] === undefined){
            lyrics.innerHTML = "Could not find song"
        }else{
            lyrics.innerHTML = data['lyrics']
        }
    
        artistHeader.innerHTML = tempName;
        songHeader.innerHTML = tempSong;
        albumHeader.innerHTML = tempAlbum;

        if(lyrics.textContent.trim() !== ''){
            lyricsContent.classList.add("show");
            art.classList.add("show");
            tester.classList.add("show")
        }
    })    
}