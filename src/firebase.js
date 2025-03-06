// --- src/firebase.js (configure your Firebase project) ---
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import compat Firestore
import { getStorage } from "firebase/storage"; // Import getStorage

const firebaseConfig = {
    apiKey: "AIzaSyDScNseD8ERxia2IXIoyqDWUJDN3a22cRs",
    authDomain: "spycat-482a6.firebaseapp.com",
    projectId: "spycat-482a6",
    storageBucket: "spycat-482a6.firebasestorage.app",
    messagingSenderId: "852756474757",
    appId: "1:852756474757:web:7135fa760defb1d27cb2ec",
    measurementId: "G-SZQKTCJZTT" 
};

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app); // Initialize storage

export const auth = firebase.auth(); // Export compat auth
export const db = app.firestore();
export {storage}; // Export storage

export default firebase;