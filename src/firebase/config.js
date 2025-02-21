// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Import GoogleAuthProvider
import { getAnalytics } from "firebase/analytics";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiL--VBPxwOfnqRuXDE85T0lpvM071_M0",
  authDomain: "agri-link-a9ea3.firebaseapp.com",
  projectId: "agri-link-a9ea3",
  storageBucket: "agri-link-a9ea3.appspot.com", // ✅ Fixed typo (use "appspot.com")
  messagingSenderId: "497988840495",
  appId: "1:497988840495:web:929a68897335e190f22ada",
  measurementId: "G-TKQZ60H3CZ"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // ✅ Added Google Sign-In Provider

export { auth, googleProvider };
