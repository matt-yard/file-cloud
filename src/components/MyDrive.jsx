import React, { useState, useEffect } from "react";
import "../styles/MyDrive.css";
import { Storage } from "aws-amplify";
import { processStorageList } from "../util";

const MyDrive = () => {
  const [fileSystem, setFileSystem] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("/");

  useEffect(() => {
    const fetchMyFiles = async () => {
      try {
        const result = await Storage.vault.list("");
        if (result.length) {
          const parsedFiles = processStorageList(result);
          setFileSystem(parsedFiles);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyFiles();
  }, []);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      await Storage.put(`newFolder/${file.name}`, file, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createFolder = async () => {
    try {
      if (newFolderName) await Storage.put(`newFolder/${newFolderName}/`);
    } catch (error) {
      console.log(error);
    }
  };

  const openFolder = (folder, folderName) => {
    const newFolderContents = { ...folder };
    console.log("new folder inside openFolder", newFolderContents);
    delete newFolderContents.__data;
    delete newFolderContents.isFolder;
    setFileSystem(newFolderContents);
    setCurrentFilePath((prev) => prev + folderName + "/");
  };

  return (
    <div id="user-drive">
      <input type="file" onChange={handleChange} />
      <input
        type="text"
        onChange={(e) => setNewFolderName(e.target.value)}
        value={newFolderName}
      />
      <button onClick={createFolder}>Create Folder</button>
      <div>
        <h1>{currentFilePath}</h1>
        {Object.keys(fileSystem).map((key) => {
          const currentFile = fileSystem[key];
          if (currentFile.isFolder) {
            return (
              <button onClick={() => openFolder(currentFile, key)} key={key}>
                {key}
              </button>
            );
          } else {
            return <p key={key}>{key}</p>;
          }
        })}
      </div>
    </div>
  );
};

export default MyDrive;
