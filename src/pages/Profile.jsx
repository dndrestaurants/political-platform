import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  // ✅ Fetch Profile Data from the Database
  useEffect(() => {
    axios.get("http://localhost:5000/api/profile")
      .then(response => {
        if (response.data) {
          setFullName(response.data.fullName || "");
          setOccupation(response.data.occupation || "");
          setPhone(response.data.phone || "");
          setAddress(response.data.address || "");
          setState(response.data.state || "");
          setCountry(response.data.country || "");
        }
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, []);

  // ✅ Save Profile Data to Database
  const handleSaveProfile = () => {
    if (fullName.trim() === "" || occupation.trim() === "") {
      alert("Please enter your full name and select an occupation.");
      return;
    }

    axios.post("http://localhost:5000/api/profile", {
      fullName,
      occupation,
      phone,
      address,
      state,
      country
    })
      .then(() => alert("Profile saved successfully!"))
      .catch(error => console.error("Error saving profile:", error));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile</h2>

      {/* Full Name Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Full Name</label>
        <input type="text" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      {/* Occupation Input (Text, Not Dropdown) */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Occupation</label>
        <input type="text" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={occupation} onChange={(e) => setOccupation(e.target.value)} required />
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Phone Number</label>
        <input type="tel" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      {/* Address Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Address</label>
        <input type="text" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {/* State Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">State</label>
        <input type="text" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={state} onChange={(e) => setState(e.target.value)} />
      </div>

      {/* Country Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Country</label>
        <input type="text" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      {/* Save Profile Button */}
      <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700 transition">
        Save Profile
      </button>
    </div>
  );
}

export default Profile;
