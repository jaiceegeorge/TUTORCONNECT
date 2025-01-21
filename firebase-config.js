// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXQZj6s8vCcTdbyehDh5Fis13IDHg8TpY",
  authDomain: "tutorconnect-login.firebaseapp.com",
  projectId: "tutorconnect-login",
  storageBucket: "tutorconnect-login.firebasestorage.app",
  messagingSenderId: "461593108524",
  appId: "1:461593108524:web:1dd4240dc6154c9334b189",
  measurementId: "G-DGV5FHS9FT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);