// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWAqNx0OLkFSsJqi3pJlp-IVqPWlLj1g0",
  authDomain: "image-survey-2024.firebaseapp.com",
  projectId: "image-survey-2024",
  storageBucket: "image-survey-2024.firebasestorage.app",
  messagingSenderId: "937331909314",
  appId: "1:937331909314:web:a6ac7c83ddb7b18156d15b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);