import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = filter === "All" ? posts : posts.filter((post) => post.category === filter);

  return (
    <div>
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-bold">Latest Posts</h2>
        <select
          className="border p-2 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>General</option>
          <option>Government Schemes</option>
          <option>Agriculture</option>
          <option>Technology</option>
        </select>
      </div>

      {filteredPosts.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg shadow-sm my-2 bg-white">
          <h3 className="font-bold">{post.username}</h3>
          <p>{post.content}</p>
          {post.fileURL && <img src={post.fileURL} alt="Post" className="w-full mt-2" />}
          <span className="text-sm text-gray-500">{post.category}</span>
        </div>
      ))}
    </div>
  );
}
