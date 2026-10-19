import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyDbrqdOMXIJHTwnNbLqxrr6dLOlf-H9dFM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interview-e0cbe.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interview-e0cbe",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interview-e0cbe.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "84352386945",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:84352386945:web:3e886ae52e3401db950a80",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9XNQJFE5RK"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };