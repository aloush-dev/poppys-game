// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKIDQEe8viQ4BjrB6SLJfW4sdIMX6e3SM",
    authDomain: "poppys-world.firebaseapp.com",
    projectId: "poppys-world",
    storageBucket: "poppys-world.firebasestorage.app",
    messagingSenderId: "758796036963",
    appId: "1:758796036963:web:5a58973d333ef54a430156",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
