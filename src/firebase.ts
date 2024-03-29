// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpUrVhl76QWFeYOJrw8MQQI-TcLxHC6tI",
    authDomain: "dwitter-41e8f.firebaseapp.com",
    projectId: "dwitter-41e8f",
    storageBucket: "dwitter-41e8f.appspot.com",
    messagingSenderId: "1091958306459",
    appId: "1:1091958306459:web:c83782eee4a34be175f83e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
