import { useState } from "react";
import { db, storage, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

export default function BlogPostForm() {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }
    if (!content && !file) return;
    setLoading(true);

    let fileURL = "";
    if (file) {
      const fileRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, "posts"), {
      content,
      fileURL,
      category,
      userId: user.uid,
      username: user.displayName || "Anonymous",
      timestamp: serverTimestamp(),
    });

    setContent("");
    setFile(null);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <textarea
        className="w-full p-2 border rounded-md"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
      ></textarea>

      <input type="file" className="my-2" onChange={(e) => setFile(e.target.files[0])} />

      <select
        className="w-full p-2 border rounded-md"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>General</option>
        <option>Government Schemes</option>
        <option>Agriculture</option>
        <option>Technology</option>
      </select>

      <button
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
