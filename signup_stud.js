import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Get signup form element
const signUpForm = document.querySelector('.sign-up form');

// Sign Up form submission
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const username = signUpForm.querySelector('input[type="text"]').value;
    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = signUpForm.querySelectorAll('input[type="password"]')[1].value;
    
    // Basic validation
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters long!");
        return;
    }
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString()
        });
        
        alert('Account created successfully!');
        // Redirect to home page or dashboard
        window.location.href = 'home.html';
        
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = "An error occurred during signup.";
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Email/password accounts are not enabled.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak.";
                break;
        }
        
        alert(errorMessage);
    }
});