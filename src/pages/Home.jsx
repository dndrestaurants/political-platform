import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({ fullName: "Anonymous", occupation: "Unknown" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://political-platform-server.onrender.com/api/profile");
        if (response.data) {
          setProfile({
            fullName: response.data.fullName || "Anonymous",
            occupation: response.data.occupation || "Unknown"
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://political-platform-server.onrender.com/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Latest Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg shadow-md bg-white">
              
              {/* Profile Info */}
              <h3 className="text-lg font-bold">
                {profile.fullName} - <span className="text-gray-600">{profile.occupation}</span>
              </h3>

              {/* Post Heading */}
              <h3 className="text-xl font-semibold text-gray-900">{post.heading}</h3>

              {/* Audio */}
              {post.audio && (
                <div className="mt-3">
                  <audio controls className="w-full">
                    <source
                      src={`https://political-platform-server.onrender.com${post.audio}`}
                      type="audio/wav"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Sources */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Sources:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {post.sources.split(",").map((src, index) => (
                      <li key={index}>
                        <a
                          href={`https://political-platform-server.onrender.com${src}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {src.split("/").pop()} 📄
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {post.links && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">References:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {post.links.split(",").map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
