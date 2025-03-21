import { useState, useRef } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa";

function Publish() {
  const [heading, setHeading] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [sources, setSources] = useState([]);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // ✅ Start Recording (.webm format)
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream); // default = webm
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSourceUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setSources([...sources, ...selectedFiles]);
  };

  const addLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("links", links.join(","));

    if (audioBlob) {
      formData.append("audio", new File([audioBlob], "recording.webm", { type: "audio/webm" }));
    }

    sources.forEach((file) => {
      formData.append("sources", file);
    });

    try {
      const response = await axios.post("https://political-platform-server.onrender.com/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Publish Your Post</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Heading */}
        <div>
          <label className="block text-lg font-semibold mb-2">Post Heading</label>
          <input
            type="text"
            placeholder="Enter a heading"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
        </div>

        {/* Audio Recorder */}
        <div>
          <label className="block text-lg font-semibold mb-2">Record Audio</label>
          <div className="w-full p-4 border rounded-lg flex flex-col items-center bg-gray-100">
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-600 text-white px-6 py-2 rounded-lg w-full hover:bg-red-700 transition flex items-center justify-center"
              >
                <FaMicrophone className="mr-2" /> Stop Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="bg-green-600 text-white px-6 py-2 rounded-lg w-full hover:bg-green-700 transition flex items-center justify-center"
              >
                <FaMicrophone className="mr-2" /> Start Recording
              </button>
            )}
            {audioBlob && <p className="mt-2 text-green-600 font-semibold">Audio recorded successfully!</p>}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-lg font-semibold mb-2">Add Sources</label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            multiple
            onChange={handleSourceUpload}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          {sources.length > 0 && (
            <div className="mt-2 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700">Selected Files:</h4>
              <ul className="list-disc pl-5 text-gray-600">
                {sources.map((file, index) => (
                  <li key={index} className="text-sm">{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links Input */}
        <div>
          <label className="block text-lg font-semibold mb-2">Add Links</label>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Add a link"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <button
              type="button"
              onClick={addLink}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Display Links */}
        {links.length > 0 && (
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-700">Added Links:</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {links.map((link, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {link}
                  </a>
                  <button type="button" onClick={() => removeLink(index)} className="text-red-600 ml-2">✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700 transition">
          Publish
        </button>
      </form>
    </div>
  );
}

export default Publish;
