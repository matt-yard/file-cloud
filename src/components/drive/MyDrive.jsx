import React, { useState, useEffect } from "react";
import "../../styles/MyDrive.css";
import { Storage } from "aws-amplify";
import { processStorageList } from "../../util";
import SideNav from "./SideNav";
import StorageInfo from "./StorageInfo";
import { FaCloudUploadAlt, FaBell } from "react-icons/fa";
import { RiSettings5Fill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import FileTile from "./FileTile";
import { useOutletContext } from "react-router-dom";

const MyDrive = () => {
  const [fileSystem, setFileSystem] = useState({});
  const [newFolderName, setNewFolderName] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [totalStorage, setTotalStorage] = useState(0);
  const [storageBreakdown, setStorageBreakdown] = useState({});
  const { currentUser, setCurrentUser } = useOutletContext();

  useEffect(() => {
    const fetchMyFiles = async () => {
      try {
        const result = await Storage.vault.list("");
        if (result.length) {
          const { parsedFiles, totalStorageUsed, storageBreakdown } =
            processStorageList(result);
          console.log(parsedFiles);
          setFileSystem(parsedFiles);
          setTotalStorage(totalStorageUsed);
          console.log("stroage breakdown in MyDrive, ", storageBreakdown);
          setStorageBreakdown(storageBreakdown);
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
        const { parsedFiles, totalStorageUsed, storageBreakdown } =
          processStorageList(result);
        setFileSystem(parsedFiles);
        setTotalStorage(totalStorageUsed);
        setStorageBreakdown(storageBreakdown);
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
            const { parsedFiles, totalStorageUsed, storageBreakdown } =
              processStorageList(result);
            setFileSystem(parsedFiles);
            setTotalStorage(totalStorageUsed);
            setStorageBreakdown(storageBreakdown);
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
      <div className="flex-row">
        <SideNav currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="flex-column">
          <nav id="top-nav">
            <div>
              <div className="top-nav-item">
                <FaCloudUploadAlt size="30px" color="#583da1" />
                <p>Add File</p>
              </div>
            </div>
            <div className="top-nav-item">
              <div className="icon-container">
                <RiSettings5Fill size="30px" />
              </div>
              <div className="icon-container">
                <FaBell size="30px" />
              </div>
              <div className="icon-container">
                <IoPerson size="30px" />
              </div>
            </div>
          </nav>
          <div className="flex-row">
            <div id="file-container">
              <div id="file-container-header">
                <h1>My Cloud</h1>
              </div>
              <div id="file-container-row">
                {Object.keys(fileSystem).map((key) => {
                  const currentFile = fileSystem[key];
                  return (
                    <FileTile
                      currentFile={currentFile}
                      openFolder={openFolder}
                      key={key}
                      name={key}
                    />
                  );
                })}
              </div>
            </div>
            <StorageInfo
              storage={{
                totalStorage,
                storageBreakdown,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDrive;
