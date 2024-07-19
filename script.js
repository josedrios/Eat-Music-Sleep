const artistInput = document.getElementById("artist-entry");
const songInput = document.getElementById("song-entry");
const lyrics = document.getElementById("lyrics");
const button = document.getElementById("confirmation");
const artistPhoto = document.getElementById("artist-photo");

const artistHeader = document.getElementById("artist-header");
const songHeader = document.getElementById("song-header");

const tags = document.getElementById("tag-section");
const from = document.getElementById("from");

const miniheads = document.getElementsByClassName("mini-heads");

const imageA = document.getElementById("artist-photo");

const art = document.getElementById("artist-content");

const lyricsContent = document.getElementById("lyrics-content");



button.addEventListener('click', async (e) => {
    const artist = artistInput.value.trim();
    const song = songInput.value.trim();
    // const artist = "Frank Ocean"
    // const song = "Ivy"
    if(song === ''){
        console.log("NO SONG")
        return;
    }

    let mbid;

    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then(response => response.json())
        .then(data => {
            console.log("-----LYRICS-----")
            console.log(data)
            lyrics.innerHTML = data['lyrics'];
            artistHeader.innerHTML = artist;
            songHeader.innerHTML = song;

            if(lyrics.textContent.trim() !== ''){
                lyricsContent.classList.add("show");
            }
        })
    
    await fetch(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`)
        .then(response => response.json())
        .then(data => {
            if(tags){
                const divs = tags.querySelectorAll('div');
                divs.forEach(div=> div.remove());
            }

            console.log("-----ARTIST INFO-----")
            console.log(`https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`);
            console.log(data)
            mbid = data['artists'][0]['id'];

            let print = JSON.parse(data['artists'][0]['tags'].length);
            console.log("---" + print + "---");
            if(print > 5){
                print = 5;
            }

            for(let i = 0; i < print; i++){
                console.log(data['artists'][0]['tags'][i]['name']);
                const newDiv = document.createElement("div");
                newDiv.innerHTML = data['artists'][0]['tags'][i]['name'];
                newDiv.id = "tags";
                tags.appendChild(newDiv);
            }
            if(tags.querySelector("*") || from.textContent.trim() !== ''){
                art.classList.add("show");
            }
            
            from.innerHTML = data['artists'][0]['area']['name'];
        })
    
    fetch(`https://webservice.fanart.tv/v3/music/${mbid}?api_key=d96e62befd65d0f471cf3b12126ac722`)
        .then(response => response.json())
        .then(data => {
            artistPhoto.src = data['artistbackground'][0]['url'];
            if(imageA.getAttribute("src").trim() !== ''){
                imageA.classList.add("show");
            }
        })
    
})