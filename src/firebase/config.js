// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Import authentication
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
export const auth = getAuth(app); // ✅ Export authentication
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // ✅ Fix for Next.js SSR

