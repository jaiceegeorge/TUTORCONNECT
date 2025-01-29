import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Function to check if string is email
function isEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

// Function to get email by username
async function getEmailByUsername(username) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("Username not found");
    }

    return querySnapshot.docs[0].data().email;
}

// Get sign-in form element
const signInForm = document.querySelector('.sign-in form');
const loginInput = signInForm.querySelector('input[type="text"]');

// Update placeholder and label based on input type
loginInput.addEventListener('input', (e) => {
    const label = loginInput.nextElementSibling.nextElementSibling;
    if (isEmail(e.target.value)) {
        label.textContent = 'email';
    } else {
        label.textContent = 'username';
    }
});

// Sign-In form submission
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const loginValue = signInForm.querySelector('input[type="text"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    try {
        let email;

        // Check if input is email or username
        if (isEmail(loginValue)) {
            email = loginValue;
        } else {
            // If username, get corresponding email
            email = await getEmailByUsername(loginValue);
        }

        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Fetch user data from Firestore
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const role = userData.role; // Fetch the user's role

            // Allow only teachers to log in
            if (role === "teacher") {
                alert("Welcome, Teacher!");
                window.location.href = "home_teach.html"; // Redirect to Teacher Dashboard
            } else {
                alert("Access Denied: Only teachers are allowed to log in.");
                return;
            }
        } else {
            throw new Error("User data not found in Firestore.");
        }

    } catch (error) {
        console.error("Error:", error);
        let errorMessage = "An error occurred during login.";

        if (error.message === "Username not found") {
            errorMessage = "Invalid username or password.";
        } else {
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    errorMessage = "Invalid login credentials.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email format.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "This account has been disabled.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many failed login attempts. Please try again later.";
                    break;
            }
        }

        alert(errorMessage);
    }
});

// Password reset link handler
const forgotPassLink = document.querySelector('.forgot-pass a');
forgotPassLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const loginValue = prompt("Enter your email or username for password reset:");

    if (loginValue) {
        try {
            let email;

            // Check if input is email or username
            if (isEmail(loginValue)) {
                email = loginValue;
            } else {
                email = await getEmailByUsername(loginValue);
            }

            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error('Error:', error);
            if (error.message === "Username not found") {
                alert('No account found with this username.');
            } else {
                alert('Error sending password reset email. Please try again.');
            }
        }
    }
});