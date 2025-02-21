"use client";

import { useState } from "react";
import { auth } from "firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState(""); // ✅ Added username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // ✅ Email & Password Signup with Username
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username }); // ✅ Store username in Firebase

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ✅ Google Sign-In with Username Handling
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // If Google account doesn't have a display name, set it to "Google User"
      if (!result.user.displayName) {
        await updateProfile(result.user, { displayName: "Google User" });
      }

      console.log("User signed in with Google");
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1625011903993-11dd928c389f')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username" // ✅ New username field
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-700 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-700 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-700 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg placeholder-gray-700 focus:ring-2 focus:ring-green-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* ✅ Google Sign-In Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
