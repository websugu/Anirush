import { db, storage } from "../firebase/config.js";
import { 
    collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { 
    ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

const animeTableBody = document.getElementById("animeTableBody");
const addAnimeForm = document.getElementById("addAnimeForm");

// 📝 Add New Anime
addAnimeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("animeTitle").value;
    const description = document.getElementById("animeDescription").value;
    const category = document.getElementById("animeCategory").value;
    const imageFile = document.getElementById("animeImage").files[0];
    const uploadDate = new Date().toLocaleDateString();
    const progressBar = document.getElementById("uploadProgress");
    const progressText = document.getElementById("progressText");

    try {
        const imageRef = ref(storage, `anime_images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(imageRef, imageFile);

        // Show the progress bar and set initial values
        progressBar.style.display = "block";
        progressBar.value = 0;
        progressText.textContent = "Uploading: 0%";

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
                progressText.textContent = `Uploading: ${Math.floor(progress)}%`;
            },
            (error) => {
                console.error("Upload error:", error);
                alert("Failed to upload image.");
                progressText.textContent = "Upload failed.";
            },
            async () => {
                const imageUrl = await getDownloadURL(imageRef);

                const animeData = {
                    title,
                    description,
                    category,
                    imageUrl,
                    uploadDate,
                    episodes: []
                };

                await addDoc(collection(db, "animes"), animeData);
                alert("Anime added successfully!");
                progressText.textContent = "Upload complete!";
                progressBar.value = 100;
                setTimeout(() => location.reload(), 1000); // Reload after a short delay
            }
        );
    } catch (error) {
        console.error("Error adding anime:", error);
        alert("Failed to add anime.");
        progressText.textContent = "Error occurred.";
    }
});

// 📂 Populate Anime Table
async function loadAnimes() {
    try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        animeTableBody.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const anime = doc.data();
            const id = doc.id;
            populateAnimeTable(id, anime);
        });
    } catch (error) {
        console.error("Error loading animes:", error);
    }
}

function populateAnimeTable(id, anime) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><img src="${anime.imageUrl}" alt="${anime.title}" style="width: 80px; height: 80px; border-radius: 8px;"></td>
        <td>${anime.title}</td>
        <td>${anime.uploadDate}</td>
        <td>
            <button onclick="deleteAnime('${id}')"><i class="fa-solid fa-trash"></i> Delete</button>
            <button onclick="addEpisodes('${id}')"><i class="fa-solid fa-film"></i> Add New Episodes</button>
            <button onclick="viewAnime('${id}')"><i class="fa-solid fa-up-right-from-square"></i> View in Platform</button>
        </td>
    `;
    animeTableBody.appendChild(row);
}

// 🗑️ Delete Anime
window.deleteAnime = async function (animeId) {
    try {
        const animeDocRef = doc(db, "animes", animeId);
        const animeDoc = await getDoc(animeDocRef);

        if (animeDoc.exists()) {
            const animeData = animeDoc.data();

            // Delete the anime image from Firebase Storage
            const imageRef = ref(storage, animeData.imageUrl);
            await deleteObject(imageRef);

            // Delete all episodes related to the anime from storage
            const episodesRef = ref(storage, `anime_episodes/${animeId}`);
            const episodesList = await listAll(episodesRef);
            for (const item of episodesList.items) {
                await deleteObject(item);
            }

            // Delete the anime document from Firestore
            await deleteDoc(animeDocRef);

            alert(`Successfully deleted anime: ${animeData.title}`);
            location.reload();
        } else {
            alert("Anime not found!");
        }
    } catch (error) {
        console.error("Error deleting anime:", error);
        alert("Failed to delete anime.");
    }
};

// ➕ Add New Episodes
// Show the "Add New Episode" popup
window.addEpisodes = function (animeId) {
    const modal = document.getElementById("addEpisodeModal");
    modal.style.display = "block";

    // Store the animeId in the modal for later use
    modal.setAttribute("data-anime-id", animeId);
};

// Close the "Add New Episode" popup
window.closeEpisodeModal = function () {
    const modal = document.getElementById("addEpisodeModal");
    modal.style.display = "none";
};

// Submit new episode
window.submitEpisode = async function () {
    const modal = document.getElementById("addEpisodeModal");
    const animeId = modal.getAttribute("data-anime-id");
    const episodeTitle = document.getElementById("episodeTitle").value;
    const episodeFile = document.getElementById("episodeFile").files[0];
    const progressBar = document.getElementById("episodeUploadProgress");
    const progressText = document.getElementById("episodeProgressText");

    if (!episodeTitle || !episodeFile) {
        alert("Please enter an episode title and select a video file.");
        return;
    }

    try {
        const episodeRef = ref(storage, `anime_episodes/${animeId}/${episodeFile.name}`);
        const uploadTask = uploadBytesResumable(episodeRef, episodeFile);

        // Show the progress bar and set initial values
        progressBar.style.display = "block";
        progressBar.value = 0;
        progressText.textContent = "Uploading: 0%";

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
                progressText.textContent = `Uploading: ${Math.floor(progress)}%`;
            },
            (error) => {
                console.error("Upload error:", error);
                alert("Failed to upload episode.");
                progressText.textContent = "Upload failed.";
            },
            async () => {
                const videoUrl = await getDownloadURL(episodeRef);

                const animeDocRef = doc(db, "animes", animeId);
                const animeDoc = await getDoc(animeDocRef);

                if (animeDoc.exists()) {
                    const animeData = animeDoc.data();
                    const newEpisode = {
                        title: episodeTitle,
                        videoUrl,
                    };

                    animeData.episodes.push(newEpisode);
                    await updateDoc(animeDocRef, { episodes: animeData.episodes });

                    alert("Episode added successfully!");
                    progressText.textContent = "Upload complete!";
                    progressBar.value = 100;
                    setTimeout(() => {
                        closeEpisodeModal();
                        location.reload();
                    }, 1000); // Reload after a short delay
                } else {
                    alert("Anime not found!");
                    progressText.textContent = "Error: Anime not found.";
                }
            }
        );
    } catch (error) {
        console.error("Error adding episode:", error);
        alert("Failed to add episode.");
        progressText.textContent = "Error occurred.";
    }
};



// 📝 View Anime on Platform
window.viewAnime = function (animeId) {
    window.location.href = `anime-details.html?id=${animeId}`;
};

// Load animes on page load
loadAnimes();

// 

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login page if not authenticated
        window.location.href = "admin-login.html";
    }
});

// Admin logout function
window.logoutAdmin = function () {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        window.location.href = "admin-login.html";
    }).catch((error) => {
        console.error("Logout failed:", error);
    });
};

// 

// Admin Anime Search
window.searchAdminAnime = function () {
    const searchInput = document.getElementById("adminAnimeSearch").value.toLowerCase();
    const animeTableBody = document.getElementById("animeTableBody");
    const animeRows = animeTableBody.getElementsByTagName("tr");

    for (let i = 0; i < animeRows.length; i++) {
        const titleCell = animeRows[i].getElementsByTagName("td")[1];
        if (titleCell) {
            const titleText = titleCell.textContent || titleCell.innerText;
            animeRows[i].style.display = titleText.toLowerCase().includes(searchInput) ? "" : "none";
        }
    }
};

