import { db } from "../firebase/config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Get the anime ID and episode number from the URL
const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("id");
const episodeNumber = parseInt(urlParams.get("episode"));

// Elements to display episode details
const watchTitle = document.getElementById("watchTitle");
const watchVideo = document.getElementById("watchVideo");

// Function to display the episode
async function displayEpisode() {
    try {
        // Get the anime document reference
        const animeDocRef = doc(db, "animes", animeId);
        const animeDoc = await getDoc(animeDocRef);

        if (animeDoc.exists()) {
            const animeData = animeDoc.data();
            const episode = animeData.episodes[episodeNumber - 1];

            if (episode) {
                watchTitle.textContent = `${animeData.title} - Episode ${episodeNumber}: ${episode.title}`;
                watchVideo.src = episode.videoUrl;
            } else {
                watchTitle.textContent = "Episode not found.";
            }
        } else {
            watchTitle.textContent = "Anime not found.";
        }
    } catch (error) {
        console.error("Error loading episode:", error);
        watchTitle.textContent = "Error loading episode.";
    }
}

// Load the episode details when the page loads
displayEpisode();

// 🔒 Anti-Inspect Mechanism

// Disable right-click
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
document.addEventListener("keydown", (e) => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
        alert("Inspecting is not allowed!");
    }
});

// Detect DevTools opening
(function detectDevTools() {
    const threshold = 160;
    const interval = 100;
    let devToolsOpen = false;

    function checkDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                alert("Inspecting the page is not allowed!");
                setTimeout(() => {
                    window.close();
                    window.location.href = "about:blank";
                }, 100);
            }
        } else {
            devToolsOpen = false;
        }
    }

    setInterval(checkDevTools, interval);
})();
