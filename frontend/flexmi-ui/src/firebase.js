// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnEMVTozwiT80RYcYKAnUyNZK3Gi4RMyM",
  authDomain: "flexmi-f4805.firebaseapp.com",
  projectId: "flexmi-f4805",
  storageBucket: "flexmi-f4805.firebasestorage.app",
  messagingSenderId: "628491517710",
  appId: "1:628491517710:web:85aecf3c1750aca8ebe15f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);