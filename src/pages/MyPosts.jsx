import { useEffect, useState } from "react";
import axios from "axios";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Load profile data from localStorage
    setFullName(localStorage.getItem("fullName") || "Anonymous");
    setOccupation(localStorage.getItem("occupation") || "Unknown");

    fetchMyPosts();
  }, []);

  // Delete Post Function
  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id)); // Remove from UI
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't posted anything yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg shadow-md bg-white">
              
              {/* Display Profile Name and Occupation */}
              <h3 className="text-lg font-bold">{fullName} - <span className="text-gray-600">{occupation}</span></h3>

              {/* Post Heading */}
              <h3 className="text-xl font-semibold">{post.heading}</h3>
              
              {/* Audio Player */}
              {post.audio && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={`http://localhost:5000${post.audio}`} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Sources */}
              {post.sources && (
                <div className="mt-3">
                  <h4 className="font-medium">Sources:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {post.sources.split(",").map((src, index) => (
                      <li key={index}>
                        <a href={`http://localhost:5000${src}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {src.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {post.links && (
                <div className="mt-3">
                  <h4 className="font-medium">References:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {post.links.split(",").map((link, index) => (
                      <li key={index}>
                        <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delete Button */}
              <button 
                onClick={() => deletePost(post.id)} 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full"
              >
                Delete Post
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPosts;
