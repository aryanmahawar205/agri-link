"use client";

import { useState, useEffect } from "react";
import { auth } from "firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Chatbot from "../../components/Chatbot";

import { useRouter } from "next/navigation";
import { FiLogOut, FiHome, FiSettings, FiUser, FiBell, FiMoon, FiSun, FiBookOpen } from "react-icons/fi";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received!" },
    { id: 2, message: "Payment processed successfully." },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    if (showNotifications) {
      const timer = setTimeout(() => {
        setShowNotifications(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined") {
        setNotifications((prev) => [
          ...prev,
          { id: prev.length + 1, message: `New update at ${new Date().toLocaleTimeString()}` },
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const markAllAsRead = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 p-6 shadow-md flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <button className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiHome className="mr-2" /> Home
          </button>
          <button className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiUser className="mr-2" /> Profile
          </button>
          <button className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiSettings className="mr-2" /> Settings
          </button>

          {/* Blog Feed Button in Sidebar */}
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center hover:text-blue-500 transition-transform transform hover:scale-105"
          >
            <FiBookOpen className="mr-2" /> Go to Blog
          </button>

          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600 transition-transform transform hover:scale-105">
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="mt-6 flex items-center">
          <FiMoon className="mr-2" />
          <div className="relative w-14 h-8">
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full transition cursor-pointer ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
              onClick={() => setDarkMode(!darkMode)}
            ></div>
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                darkMode ? "translate-x-6" : "translate-x-0"
              } cursor-pointer`}
              onClick={() => setDarkMode(!darkMode)}
            ></div>
          </div>
          <FiSun className="ml-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Welcome, {user?.displayName || "User"} 🎉</h1>

          

          {/* Notification Center */}
          <div className="relative">
            <button
              className="hover:scale-110 transition-transform relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell className="text-xl" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg p-4 z-50">
                <h3 className="text-sm font-semibold mb-2">Notifications</h3>
                <ul className="space-y-2 max-h-40 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <li key={notif.id} className="text-xs border-b py-2 last:border-none">
                        {notif.message}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs py-2 text-gray-500">No new notifications</li>
                  )}
                </ul>

                {/* Mark All as Read Button */}
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="w-full mt-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="mb-4">Your dashboard overview</p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-green-400 to-blue-500 text-white transition-transform transform hover:scale-105">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-purple-500 text-white transition-transform transform hover:scale-105">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold">$4,320</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-red-400 to-orange-500 text-white transition-transform transform hover:scale-105">
            <h3 className="text-lg font-semibold">Pending Requests</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
      </div>
      <Chatbot />

    </div>
  );
}
