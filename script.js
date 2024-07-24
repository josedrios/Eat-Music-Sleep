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
const explicit = document.getElementById("explicit");
const album = document.getElementById("album-photo");
const preview = document.getElementById("preview");

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

const song = "ivy";
// API (INFORMATION RETRIEVAL)
btn.addEventListener('click', async (e) => {
    //const song = songInput.value.trim();
    await fetch(`https://api.lyrics.ovh/suggest/${song}&fmt=json`)
        .then(response => response.json())
        .then(data => {
            let resultsLength = JSON.parse(data['data'].length);

            if(resultsLength === 0){
                console.log("No Results Found")
            }

            for(i=0; i< 5; i++){
                const currentArtist = data.data[i].artist.name;
                const currentSong = data.data[i].title;
                const currentImg = data.data[i].artist.picture;
                const adding = document.createElement('div');

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

            const buttons = document.querySelectorAll('.find-lyrics-btn');
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    populateLyrics(data, index)
                });
            });

            // REMOVE AFTER UI CLEAN UP
            populateLyrics(data, 0)
            resultsContainer.style.display = "none"
        })

})

function populateLyrics(data, index){
    const tempName = data.data[index].artist.name;
    const tempSong = data.data[index].title;
    const tempAlbum = data.data[index].album.title;
    const artistPic = data.data[index].artist.picture;
    const albumPic = data.data[index].album.cover;
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
        }

    })    
    

}







// btn.addEventListener('click', async (e) => {
//     // const artist = artistInput.value.trim();
//     // const song = songInput.value.trim();
//     const artist = "Frank Ocean"
//     const song = "Ivy"

//     if(song === ''){
//         alerter.classList.add("show");
//         setTimeout(function(){
//             alerter.classList.remove("show");
//         }, 3000)
//         return
//     }

//     if(artist !== '' && song !== ''){
//         await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log("-----LYRICS-----")
//             console.log(data)

//             if(data['lyrics'] === undefined){
//                 lyrics.innerHTML = "Could not find song"
//             }else{
//                 
//             }
            
//             artistHeader.innerHTML = artist;
//             songHeader.innerHTML = song;

//             if(lyrics.textContent.trim() !== ''){
//                 lyricsContent.classList.add("show");
//                 art.classList.add("show");
//             }
//         })

//     } else if(artist === '' && song !== ''){
        
//     }

//     let mbid;
    
//     await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`)
//         .then(response => response.json())
//         .then(data => {
//             if(tags){
//                 const divs = tags.querySelectorAll('div');
//                 divs.forEach(div=> div.remove());
//             }

//             console.log("-----ARTIST INFO-----")
//             console.log(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`);
//             console.log(data)
//             mbid = data['artists'][0]['id'];

//             let print = JSON.parse(data['artists'][0]['tags'].length);
//             console.log("---" + print + "---");
//             if(print > 5){
//                 print = 5;
//             }

//             for(let i = 0; i < print; i++){
//                 console.log(data['artists'][0]['tags'][i]['name']);
//                 const newDiv = document.createElement("div");
//                 newDiv.innerHTML = data['artists'][0]['tags'][i]['name'];
//                 newDiv.id = "tags";
//                 tags.appendChild(newDiv);
//             }
//             if(tags.querySelector("*") || from.textContent.trim() !== ''){
//                 art.classList.add("show");
//             }
            
//             from.innerHTML = data['artists'][0]['area']['name'];
//         })
    
//     fetch(`https://webservice.fanart.tv/v3/music/${mbid}?api_key=d96e62befd65d0f471cf3b12126ac722`)
//         .then(response => response.json())
//         .then(data => {
//             artistPhoto.src = data['artistbackground'][0]['url'];
//             if(imageA.getAttribute("src").trim() !== ''){
//                 imageA.classList.add("show");
//             }
//         })
    
// })