import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Publish from "./pages/Publish";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";  // Import Profile Page

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-16 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />  {/* Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
