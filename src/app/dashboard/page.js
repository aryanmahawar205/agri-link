"use client";

import { useState, useEffect } from "react";
import { auth } from "firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiLogOut, FiHome, FiSettings, FiUser } from "react-icons/fi";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 hidden md:block">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="mt-6">
          <a href="#" className="flex items-center p-3 hover:bg-gray-700 rounded">
            <FiHome className="mr-2" /> Home
          </a>
          <a href="#" className="flex items-center p-3 hover:bg-gray-700 rounded">
            <FiUser className="mr-2" /> Profile
          </a>
          <a href="#" className="flex items-center p-3 hover:bg-gray-700 rounded">
            <FiSettings className="mr-2" /> Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 mt-5 bg-red-600 hover:bg-red-700 rounded"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.displayName || "User"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-300">Here’s what’s happening today.</p>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Card 1 */}
            <div className="bg-green-500 text-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Active Users</h3>
              <p className="text-3xl font-bold mt-2">1,245</p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">New Messages</h3>
              <p className="text-3xl font-bold mt-2">34</p>
            </div>

            {/* Card 3 */}
            <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Pending Tasks</h3>
              <p className="text-3xl font-bold mt-2">8</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
