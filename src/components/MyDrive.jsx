import React, { useState, useEffect } from "react";
import "../styles/MyDrive.css";
import { Storage } from "aws-amplify";
import { useOutletContext } from "react-router-dom";

const MyDrive = () => {
  const { currentUser } = useOutletContext();
  const { myFiles, setMyFiles } = useState([]);

  useEffect(() => {
    const fetchMyFiles = async () => {
      const result = await Storage.vault.list("");
      console.log("my files, ", result);
    };
    fetchMyFiles();
  }, []);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      await Storage.put(file.name, file, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="user-drive">
      <input type="file" onChange={handleChange} />
    </div>
  );
};

export default MyDrive;
