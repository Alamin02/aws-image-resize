import { useState, useEffect } from "react";
import shortid from "shortid";

import FileInput from "./components/FileInput";
import Status from "./components/Status";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("USER_ID"));
  const [error, setError] = useState("");
  const [status, setStatus] = useState([]);

  const fetchProcessingStatus = async (userId) => {
    return fetch(`http://localhost:3000/api/v1/images/${userId}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setStatus(data);
      })
      .catch(() => {
        setError("Could not fetch status");
      });
  };

  useEffect(() => {
    if (!userId) {
      const generatedUserId = shortid.generate();
      localStorage.setItem("USER_ID", generatedUserId);
      setUserId(generatedUserId);
    } else {
      fetchProcessingStatus(userId);
      setInterval(() => fetchProcessingStatus(userId), 5000);
    }
  }, [userId]);

  const uploadFiles = (files) => {
    const formData = new FormData();
    formData.append("userId", userId);

    files.forEach((file) => {
      formData.append("images", file);
    });

    return fetch(`http://localhost:3000/api/v1/images/`, {
      method: "post",
      body: formData,
    });
  };

  const handleFileInput = async (e) => {
    const inputFiles = e.target.files || [];

    if (inputFiles.length > 5) {
      setError("You can add max 5 images");
    } else {
      uploadFiles([...inputFiles]).then(() => {
        fetchProcessingStatus(userId);
      });
    }
  };

  return (
    <div className="App">
      <p>Upload file:</p>
      <FileInput onChange={handleFileInput} />

      <p>{error}</p>

      <Status status={status} />
    </div>
  );
}

export default App;
