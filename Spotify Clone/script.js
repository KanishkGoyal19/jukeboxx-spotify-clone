let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }

    // Clear the current song list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ''; // Clear current songs

    // Show all the songs in the playlist
    for (const song of songs) {
        const originalFileName = song.split("/").pop();
        const songName = originalFileName.replaceAll("%20", " ");
        const artist = songName.includes("-") ? songName.split("-")[0].trim() : "Unknown Artist";
        const title = songName.includes("-") ? songName.split("-")[1].replace(".mp3", "").trim() : songName.replace(".mp3", "");

        songUL.innerHTML += `
            <li data-file-name="${originalFileName}">
                <img class="invert no-hover" src="images/music.svg" alt="music icon">
                <div class="info">
                    <div>${title}</div>
                    <div>by ${artist}</div>
                </div>
            </li>`;
    }

    // Event listener for each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            const fileName = li.getAttribute("data-file-name");
            playMusic(`${fileName}`);
        });
    });

    // Play the first song of the album
    if (songs.length > 0) {
        playMusic(songs[0]);
    }
}

// Update album click handler to call getSongs with the correct alb
Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        const albumFolder = item.currentTarget.dataset.folder; // Get the album folder
        await getSongs(`songs/${albumFolder}`);  // Get the songs for that album
    });
});

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    }

    let songName = track.split("/").pop().replaceAll("%20", " ").replace(".mp3", "");
    let artist = songName.includes("-") ? songName.split("-")[0].trim() : "Unknown Artist";
    let title = songName.includes("-") ? songName.split("-")[1].trim() : songName;

    document.querySelector(".songInfo").innerHTML = `${title} - ${artist}`;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; // Clear any existing cards
    let array = Array.from(anchors);

    for (let i = 0; i < anchors.length; i++) {
        const e = array[i];
        if (e.href.includes("/songs/")) {
            let folderName = e.href.split("/").slice(-1)[0];
            let albumData = await fetch(`http://127.0.0.1:5500/songs/${folderName}/info.json`);
            let albumInfo = await albumData.json();

            // Add card to the container with correct folder name in data-folder
            cardContainer.innerHTML += `
                <div class="card no-hover" data-folder="${folderName}">
                    <img class="play-button" src="images/button.svg" alt="Play">
                    <img class="no-hover" src="/songs/${folderName}/cover.jpg" alt="Album Cover">
                    <h2 class="no-hover">${albumInfo.title}</h2>
                    <p class="no-hover">${albumInfo.description}</p>
                </div>`;
        }
    }

    // Add click event listener to all dynamically created album cards
    Array.from(cardContainer.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async item => {
            const albumFolder = item.currentTarget.dataset.folder; // Get folder name from data-folder
            await getSongs(`songs/${albumFolder}`); // Fetch songs for the album and play the first song
        });
    });
}


async function main() {
    //Get the songs
    await getSongs("songs/album1");
    playMusic(songs[0], true);

    //Display albums on the page
    displayAlbums();

    // Add an event listener for play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });

    // Add an event listener for timeupdate
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    document.querySelector("#prev").addEventListener("click", () => {
        const currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        const currentTime = currentSong.currentTime;

        if (currentTime > 3) {
            currentSong.currentTime = 0;
            currentSong.play();
        } else if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1]);
        }
    });

    // Add an event listener to next
    document.querySelector("#next").addEventListener("click", () => {
        const currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1]);
        }
    });

    // Volume slider change event
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;

        const volumeIcon = document.querySelector(".volume > img");

        if (currentSong.volume === 0) {
            // Change to mute icon
            volumeIcon.src = volumeIcon.src.replace("volume.svg", "mute.svg");
        } else {
            // Change to volume icon
            volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
        }
    });

    // Volume button click event
    document.querySelector(".volume > img").addEventListener("click", () => {
        const volumeSlider = document.querySelector(".range").getElementsByTagName("input")[0];
        const volumeIcon = document.querySelector(".volume > img");

        if (currentSong.volume > 0) {
            // Mute the volume
            currentSong.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.src = volumeIcon.src.replace("volume.svg", "mute.svg");
            console.log("Muted volume");
        } else {
            // Unmute and set volume to 50% (or any default value)
            currentSong.volume = 0.5;
            volumeSlider.value = 50;
            volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
            console.log("Unmuted volume, set to 50%");
        }
    });

    Array.from(document.getElementsByClassName(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}

main();