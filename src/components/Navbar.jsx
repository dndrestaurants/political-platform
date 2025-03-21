import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-red-700 shadow-md fixed top-0 left-0 w-full z-50 h-16 flex items-center">
      <div className="w-full flex justify-center space-x-10">
        <Link to="/" className="bg-black text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition">
          Home
        </Link>
        <Link to="/publish" className="bg-black text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition">
          Publish
        </Link>
        <Link to="/my-posts" className="bg-black text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition">
          My Posts
        </Link>
        <Link to="/profile" className="bg-black text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition">
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
