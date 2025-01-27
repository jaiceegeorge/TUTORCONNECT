// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXQZj6s8vCcTdbyehDh5Fis13IDHg8TpY",
    authDomain: "tutorconnect-login.firebaseapp.com",
    projectId: "tutorconnect-login",
    storageBucket: "tutorconnect-login.firebasestorage.app",
    messagingSenderId: "461593108524",
    appId: "1:461593108524:web:1dd4240dc6154c9334b189",
    measurementId: "G-DGV5FHS9FT"
  };
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google login function
function googleLogin() {
    console.log("Google login button clicked");
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("Logged in as:", user.displayName, user.email);
        alert(`Welcome, ${user.displayName}!`);
      })
      .catch((error) => {
        console.error("Login Failed:", error.message);
        alert("Login Failed. Please Try Again.");
      });
  }
// Attach the googleLogin function to the button
document.getElementById("google-login").addEventListener("click", googleLogin);
