import { db } from "../firebase/config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Get the anime ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("id");

// Elements to display anime details
const animeImage = document.getElementById("animeImage");
const animeTitle = document.getElementById("animeTitle");
const animeDescription = document.getElementById("animeDescription");
const episodesList = document.getElementById("episodesList");
const animeCover = document.getElementById("animeCover");


// Function to display anime details
async function displayAnimeDetails() {
    try {
        // Get anime document reference
        const animeDocRef = doc(db, "animes", animeId);
        const animeDoc = await getDoc(animeDocRef);

        if (animeDoc.exists()) {
            const animeData = animeDoc.data();

            // Display anime details
            animeImage.src = animeData.imageUrl;
            animeTitle.textContent = animeData.title;
            animeDescription.textContent = animeData.description;
            animeCover.src = animeData.imageUrl;
            animeCover.style.backgroundImage = `url(${animeData.imageUrl})`;
            animeCover.style.backgroundSize = "cover"; 
            animeCover.style.backgroundRepeat = "no-repeat"
            animeCover.style.filter = "blur(15px)";
            animeCover.style.opacity = "0.8"; // Adjust transparency
            // Check if episodes exist
            if (animeData.episodes && animeData.episodes.length > 0) {
                episodesList.innerHTML = "";
                animeData.episodes.forEach((episode, index) => {
                    const li = document.createElement("li");
                    li.textContent = `Episode ${index + 1}: ${episode.title}`;
                    li.addEventListener("click", () => {
                        window.location.href = `watch.html?id=${animeId}&episode=${index + 1}`;
                    });
                    episodesList.appendChild(li);
                });
            } else {
                episodesList.textContent = "No episodes available.";
            }
        } else {
            animeTitle.textContent = "Anime not found.";
        }
    } catch (error) {
        console.error("Error loading anime details:", error);
        animeTitle.textContent = "Error loading anime details.";
    }
}

// Call the function to display anime details
displayAnimeDetails();


