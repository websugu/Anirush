// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

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
const storage = getStorage(app);

// Toggle between Login and Register forms
function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

// Register a new user
async function registerUser() {
    const profileName = document.getElementById("profileName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const profileImage = document.getElementById("profileImage").files[0];
    const registerMessage = document.getElementById("registerMessage");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let profileImageUrl = "";
        if (profileImage) {
            const imageRef = ref(storage, `profile_images/${user.uid}/${profileImage.name}`);
            await uploadBytes(imageRef, profileImage);
            profileImageUrl = await getDownloadURL(imageRef);
        }

        // Update user profile with name and image
        await updateProfile(user, {
            displayName: profileName,
            photoURL: profileImageUrl,
        });

        registerMessage.textContent = "Registration successful!";
        alert("Registration successful!");
        window.location.href = "my-profile.html";
    } catch (error) {
        registerMessage.textContent = `Error: ${error.message}`;
    }
}

// Log in an existing user
async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginMessage = document.getElementById("loginMessage");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginMessage.textContent = "Login successful!";
        alert("Login successful!");
        window.location.href = "my-profile.html";
    } catch (error) {
        loginMessage.textContent = `Error: ${error.message}`;
    }
}

// Log out the user
function logoutUser() {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
        window.location.href = "animes.html";
    }).catch((error) => {
        alert(`Error logging out: ${error.message}`);
    });
}

// Check if the user is authenticated
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User logged in:", user);
        } else {
            alert("No user logged in.");
            window.location.href = "auth.html";
        }
    });
}

// Export functions to use in HTML
window.showLogin = showLogin;
window.showRegister = showRegister;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.checkAuth = checkAuth;

// 

