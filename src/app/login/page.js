"use client";

import { useState, useEffect } from "react";
import { auth } from "firebase/config";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // ✅ Stores logged-in user
  const router = useRouter();

  // ✅ Check if user is already logged in (Session Persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/dashboard"); // ✅ Auto-redirect if logged in
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Email & Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      router.push("/dashboard"); // ✅ Redirect after login
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1625011903993-11dd928c389f')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-md">
        {user ? (
          // ✅ Show username instead of email
          <h2 className="text-2xl font-bold text-center text-black">Welcome, {user.displayName || "User"}!</h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Google Sign-In Button */}
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

            <p className="text-white text-center mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-green-400 hover:underline">
                Sign up
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
