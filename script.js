const artistInput = document.getElementById("artist-entry");
const songInput = document.getElementById("song-entry");
const lyrics = document.getElementById("lyrics");
const button = document.getElementById("confirmation");
const artistPhoto = document.getElementById("artist-photo");

const artistHeader = document.getElementById("artist-header");
const songHeader = document.getElementById("song-header");

const tags = document.getElementById("tags");
const from = document.getElementById("from");

button.addEventListener('click', async (e) => {
    //const artist = artistInput.value.trim();
    //const song = songInput.value.trim();

    const artist = "Frank Ocean"
    const song = "Rushes"

    let mbid;
    let test = [];

    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then(response => response.json())
        .then(data => {
            console.log("-----LYRICS-----")
            console.log(data)
            lyrics.innerHTML = data['lyrics'];
            artistHeader.innerHTML = artist;
            songHeader.innerHTML = song;
        })
    
    await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`)
        .then(response => response.json())
        .then(data => {
            console.log("-----ARTIST INFO-----")
            console.log(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`);
            console.log(data)
            mbid = data['artists'][0]['id'];

            let print = JSON.parse(data['artists'][0]['tags'].length);
            console.log("---" + print + "---");

            tags.innerHTML = data['artists'][0]['tags'][0]['name'];
            from.innerHTML = data['artists'][0]['area']['name'];
        })
    
    fetch(`https://webservice.fanart.tv/v3/music/${mbid}?api_key=d96e62befd65d0f471cf3b12126ac722`)
        .then(response => response.json())
        .then(data => {
            // ARTIST PICTURE
            artistPhoto.src = data['artistbackground'][0]['url'];
        })
    
})