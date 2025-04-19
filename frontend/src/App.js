import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({ author: "", description: "" });
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMetadataChange = (event) => {
    const { name, value } = event.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    try {
      const fileContent = await file.arrayBuffer();
      const base64Content = btoa(
        new Uint8Array(fileContent).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await axios.post(
        "https://2dudt58mq2.execute-api.us-east-1.amazonaws.com/dev/upload",
        {
          fileName: file.name,
          fileContent: base64Content,
          metadata,
        }
      );

      setMessage(response.data.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <div>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={metadata.author}
          onChange={handleMetadataChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={metadata.description}
          onChange={handleMetadataChange}
        />
      </div>
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;