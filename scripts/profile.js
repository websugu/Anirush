import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
const auth = getAuth(app);

// DOM Elements
const profileImage = document.getElementById("profileImage");
const profileNameDisplay = document.getElementById("profileNameDisplay");
const emailDisplay = document.getElementById("emailDisplay");
const logoutButton = document.getElementById("logoutButton");
const backToAnimesButton = document.getElementById("backToAnimesButton");

// Check Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        const { displayName, email, photoURL } = user;

        profileImage.src = photoURL || "https://i.pinimg.com/736x/f8/84/7b/f8847b5a92b0e321d6df26ebaee9b39c.jpg";
        profileNameDisplay.textContent = displayName || "Anonymous";
        emailDisplay.textContent = `${email}`;
    } else {
        // alert("You must be logged in to access this page.");
        window.location.href = "auth.html";
    }
});

// Logout function
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
        window.location.href = "animes.html";
    }).catch((error) => {
        alert(`Error logging out: ${error.message}`);
    });
});

// Back to Animes
backToAnimesButton.addEventListener("click", () => {
    window.location.href = "animes.html";
});
