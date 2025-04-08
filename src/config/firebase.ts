// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2KYCK6X0yvpzOaEeHQYOjPPAnkCHwMBU",
  authDomain: "my-awesome-recipe-v2.firebaseapp.com",
  projectId: "my-awesome-recipe-v2",
  storageBucket: "my-awesome-recipe-v2.firebasestorage.app",
  messagingSenderId: "537952578975",
  appId: "1:537952578975:web:dd0398442273aabd8b21aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
