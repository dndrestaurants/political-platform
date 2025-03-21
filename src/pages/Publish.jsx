import { useState, useRef } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa";
import RecordRTC from "recordrtc";

function Publish() {
  const [heading, setHeading] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [sources, setSources] = useState([]);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // ✅ Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm", // widely supported
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not supported.");
      console.error("Error starting recording:", err);
    }
  };

  // ✅ Stop Recording
  const stopRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setAudioBlob(blob);
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      });
    }
  };

  const handleSourceUpload = (e) => {
    setSources([...sources, ...Array.from(e.target.files)]);
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("links", links.join(","));

    if (audioBlob) {
      formData.append("audio", new File([audioBlob], "recording.webm", { type: "audio/webm" }));
    }

    sources.forEach((file) => formData.append("sources", file));

    try {
      const response = await axios.post(
        "https://political-platform-server.onrender.com/api/posts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      setHeading("");
      setAudioBlob(null);
      setSources([]);
      setLinks([]);
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Publish Your Post</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-semibold mb-2">Post Heading</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Enter a heading"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Record Audio</label>
          <div className="w-full p-4 border rounded-lg flex flex-col items-center bg-gray-100">
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full flex items-center justify-center"
              >
                <FaMicrophone className="mr-2" /> Stop Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full flex items-center justify-center"
              >
                <FaMicrophone className="mr-2" /> Start Recording
              </button>
            )}
            {audioBlob && <p className="mt-2 text-green-600 font-semibold">Audio recorded successfully!</p>}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Add Sources</label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.png"
            onChange={handleSourceUpload}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Add Links</label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Add a link"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addLink} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add
            </button>
          </div>
        </div>

        {links.length > 0 && (
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
        )}

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700">
          Publish
        </button>
      </form>
    </div>
  );
}

export default Publish;
