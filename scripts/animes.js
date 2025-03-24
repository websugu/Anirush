// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiD7_1letMuZHrReMjUDoA-m32zYvRDO4",
    authDomain: "insta-clone-7a44a.firebaseapp.com",
    projectId: "insta-clone-7a44a",
    storageBucket: "insta-clone-7a44a.appspot.com",
    messagingSenderId: "697215567024",
    appId: "1:697215567024:web:a48df90a4842a1d96c6775",
    measurementId: "G-M076ZMB5K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// Display all animes on the page
async function displayAnimes() {
    const animeListContainer = document.getElementById("animeList");

    try {
        const snapshot = await getDocs(collection(db, "animes"));
        snapshot.forEach(async (doc) => {
            const anime = doc.data();
            const animeItem = document.createElement("div");
            animeItem.classList.add("anime-item");

            // Get the anime image URL
            const imageUrl = await getDownloadURL(ref(storage, anime.imageUrl));

            animeItem.innerHTML = `
            <div onclick="goToAnimeDetails('${doc.id}')" class="card">
                <img src="${imageUrl}" alt="${anime.title}">
                <div>
                    <h3>${anime.title} | Sub </h3>
                <div>
            </div>
            `;

            animeListContainer.appendChild(animeItem);
        });
    } catch (error) {
        console.error("Error fetching animes:", error);
    }
}
// REMOVED
{/* <p>${anime.description}</p> */}
// Redirect to anime details page
window.goToAnimeDetails = function (animeId) {
    window.location.href = `anime-details.html?id=${animeId}`;
};

// Anime search function
window.searchAnime = async function () {
    const queryInput = document.getElementById("animeSearch").value.toLowerCase();
    const suggestionList = document.getElementById("suggestionList");

    // Clear previous suggestions
    suggestionList.innerHTML = "";

    if (queryInput === "") return;

    try {
        const snapshot = await getDocs(collection(db, "animes"));
        snapshot.forEach((doc) => {
            const anime = doc.data();
            const animeName = anime.title.toLowerCase();

            // Check if anime title matches search query
            if (animeName.includes(queryInput)) {
                const suggestionItem = document.createElement("div");
                suggestionItem.classList.add("suggestion-item");

                // Anime Image
                const animeImage = document.createElement("img");
                animeImage.src = anime.imageUrl;
                animeImage.alt = anime.title;
                animeImage.style.width = "40px";
                animeImage.style.height = "40px";
                animeImage.style.borderRadius = "5px";
                animeImage.style.marginRight = "10px";

                // Anime Title
                const animeTitle = document.createElement("span");
                animeTitle.textContent = anime.title;

                // Combine image and title in the suggestion item
                suggestionItem.appendChild(animeImage);
                suggestionItem.appendChild(animeTitle);

                // Click to go to anime details
                suggestionItem.onclick = () => {
                    window.location.href = `anime-details.html?id=${doc.id}`;
                };

                suggestionList.appendChild(suggestionItem);
            }
        });
    } catch (error) {
        console.error("Error searching anime:", error);
    }
};

// Initial display of animes when the page loads
window.onload = displayAnimes;

// Cancel the search and clear the input
window.cancelSearch = function () {
    const animeSearch = document.getElementById("animeSearch");
    const suggestionList = document.getElementById("suggestionList");

    animeSearch.value = "";  // Clear the input field
    suggestionList.innerHTML = "";  // Clear the suggestion list
};

