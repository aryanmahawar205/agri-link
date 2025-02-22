"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "firebase/config";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiLogOut, FiHome, FiSettings, FiUser, FiMoon, FiSun, FiPlus, FiSearch, FiPaperclip } from "react-icons/fi";

export default function Blog() {
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", media: null, mediaUrl: null });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode);
    }
  }, [darkMode]);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetchedPosts);
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handlePost = async () => {
    console.log("📢 Posting started...");
  
    if (!newPost.title || !newPost.content) {
      console.log("❌ Error: Title or content is missing!");
      return;
    }
  
    try {
      let mediaUrl = null;
      if (newPost.media) {
        console.log("📂 Uploading media...");
        mediaUrl = await handleFileUpload(newPost.media);
        console.log("✅ Media uploaded:", mediaUrl);
      }
  
      const docRef = await addDoc(collection(db, "blogPosts"), {
        title: newPost.title,
        content: newPost.content,
        mediaUrl: mediaUrl || null,
        createdAt: serverTimestamp(),
      });
  
      console.log("✅ Post added to Firestore with ID:", docRef.id);
  
      // Reset input fields
      setNewPost({ title: "", content: "", media: null, mediaUrl: null });
      setShowCreatePost(false);
  
      // Fetch updated posts
      fetchPosts();
    } catch (error) {
      console.error("❌ Error adding post:", error);
    }
  };
  

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 p-6 shadow-md flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-6">Blog</h2>
        <nav className="space-y-4">
          <button onClick={() => router.push("/dashboard")} className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiHome className="mr-2" /> Dashboard
          </button>
          <button className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiUser className="mr-2" /> Profile
          </button>
          <button className="flex items-center hover:text-green-500 transition-transform transform hover:scale-105">
            <FiSettings className="mr-2" /> Settings
          </button>
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600 transition-transform transform hover:scale-105">
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="mt-6 flex items-center">
          <FiMoon className="mr-2" />
          <div className="relative w-14 h-8">
            <div className={`absolute top-0 left-0 w-full h-full rounded-full transition cursor-pointer ${darkMode ? "bg-gray-700" : "bg-gray-300"}`} onClick={() => setDarkMode(!darkMode)}></div>
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"} cursor-pointer`} onClick={() => setDarkMode(!darkMode)}></div>
          </div>
          <FiSun className="ml-2" />
        </div>
      </div>

      {/* Blog Content */}
      <div className="flex-1 p-6">
        {/* Search Bar & Add Post */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search posts..."
              className={`pl-10 pr-3 py-2 border rounded-lg bg-transparent ${darkMode ? "text-white border-gray-600" : "text-gray-900 border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Post Button */}
          <button onClick={() => setShowCreatePost(!showCreatePost)} className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition">
            <FiPlus size={24} />
          </button>
        </div>

        {/* Create Post Section */}
        {showCreatePost && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full p-2 mb-2 border rounded bg-transparent text-black dark:text-white"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Write your post..."
              className="w-full p-2 border rounded mb-2 bg-transparent text-black dark:text-white"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            ></textarea>

            {/* File Attachment Button */}
            <label className="flex items-center space-x-2 cursor-pointer text-blue-500">
              <FiPaperclip size={20} />
              <span>Attach File</span>
              <input type="file" accept="image/*, video/*" className="hidden" onChange={(e) => setNewPost({ ...newPost, media: e.target.files[0] })} />
            </label>

            <button onClick={handlePost} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              Publish
            </button>
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts
              .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((post) => (
                <div key={post.id} className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-700">{post.content}</p>
                  {post.mediaUrl && <img src={post.mediaUrl} className="mt-3 rounded-lg max-w-full" />}
                  <p className="text-sm text-gray-500 mt-2">Posted on {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
