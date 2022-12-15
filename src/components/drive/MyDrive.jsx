import React, { useState, useEffect } from "react";
import "../../styles/MyDrive.css";
import { Storage } from "aws-amplify";
import { processStorageList } from "../../util";
import pdfIcon from "../../icons/pdf-icon.svg";
import folderIcon from "../../icons/folder-icon.svg";
import imgIcon from "../../icons/jpeg-icon.svg";
import SideNav from "./SideNav";

const fileIcons = {
  pdf: pdfIcon,
  folder: folderIcon,
  jpeg: imgIcon,
  png: imgIcon,
};

const MyDrive = () => {
  const [fileSystem, setFileSystem] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [totalStorage, setTotalStorage] = useState(0);

  useEffect(() => {
    const fetchMyFiles = async () => {
      try {
        const result = await Storage.vault.list("");
        if (result.length) {
          const { parsedFiles, totalStorageUsed } = processStorageList(result);
          setFileSystem(parsedFiles);
          setTotalStorage(totalStorageUsed);
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
      await Storage.put(
        `${currentFilePath ? currentFilePath + "/" : ""}${file.name}`,
        file,
        {
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
          },
        }
      );

      const result = await Storage.vault.list("");
      if (result.length) {
        const { parsedFiles, totalStorageUsed } = processStorageList(result);
        setFileSystem(parsedFiles);
        setTotalStorage(totalStorageUsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createFolder = async () => {
    try {
      if (newFolderName) {
        try {
          await Storage.put(
            `${currentFilePath ? currentFilePath + "/" : ""}${newFolderName}/`
          );
          const result = await Storage.vault.list("");
          if (result.length) {
            const { parsedFiles, totalStorageUsed } =
              processStorageList(result);
            setFileSystem(parsedFiles);
            setTotalStorage(totalStorageUsed);
          }
        } catch (error) {
          console.log(error);
        }
      }
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
      <div className="input-banner">
        <input type="file" onChange={handleChange} />
        <input
          type="text"
          onChange={(e) => setNewFolderName(e.target.value)}
          value={newFolderName}
        />
        <button onClick={createFolder}>Create Folder</button>
      </div>

      <h1>{currentFilePath}</h1>
      <div className="flex-row">
        <SideNav />
        <div id="file-container">
          {Object.keys(fileSystem).map((key) => {
            const currentFile = fileSystem[key];
            if (currentFile.isFolder) {
              return (
                <div
                  className="file-item"
                  onDoubleClick={() => openFolder(currentFile, key)}
                >
                  <img src={folderIcon} className="file-icon" alt="icon" />
                  <p key={key}>{key}</p>
                </div>
              );
            } else {
              return (
                <div className="file-item">
                  <img
                    src={fileIcons[currentFile.fileType]}
                    className="file-icon"
                    alt="icon"
                  />
                  <p key={key}>{key}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      <p>Storage: {totalStorage} MB / 100 MB</p>
    </div>
  );
};

export default MyDrive;
