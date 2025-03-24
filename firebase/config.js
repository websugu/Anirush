// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
