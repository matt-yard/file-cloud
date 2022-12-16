import React, { useState, useEffect, useRef } from "react";
import "../../styles/MyDrive.css";
import { Storage } from "aws-amplify";
import {
  processStorageList,
  getFolderContents,
  deepClone,
  navigateToFolder,
} from "../../util";
import SideNav from "./SideNav";
import StorageInfo from "./StorageInfo";
import { RiSettings5Fill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import FileTile from "./FileTile";
import { useOutletContext } from "react-router-dom";
import { FaFolder, FaBell } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUploader from "./FileUploader";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";

const MyDrive = () => {
  const {
    fileSystem,
    setFileSystem,
    totalStorage,
    setTotalStorage,
    storageBreakdown,
    setStorageBreakdown,
  } = useOutletContext();
  const [newFolderName, setNewFolderName] = useState("New Folder");
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { currentUser, setCurrentUser } = useOutletContext();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [currentFileSystem, setCurrentFileSystem] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    const nfs = deepClone(fileSystem);
    const currentFolder = navigateToFolder(currentFilePath, nfs);
    setCurrentFileSystem(deepClone(currentFolder));
  }, [fileSystem]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [creatingFolder]);

  const createFolder = async (e) => {
    e.preventDefault();
    try {
      if (newFolderName) {
        try {
          await Storage.put(
            `${currentFilePath ? currentFilePath : ""}${newFolderName}/`
          );
          const result = await Storage.vault.list("");
          if (result.length) {
            const { parsedFiles, totalStorageUsed, storageBreakdown } =
              processStorageList(result);
            setFileSystem(parsedFiles);
            setTotalStorage(totalStorageUsed);
            setStorageBreakdown(storageBreakdown);
            setCreatingFolder(false);
            setCurrentFilePath("");
            toast.success("Folder Created!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
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
    console.log(currentFileSystem);
    let newFileSystem = getFolderContents(folderName, currentFileSystem);
    console.log("newFileSystem", newFileSystem);
    setCurrentFileSystem(newFileSystem);
    setCurrentFilePath(newFolderContents.__data.key);
  };

  return (
    <div id="user-drive">
      <ToastContainer />
      <div className="flex-row">
        <SideNav currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="flex-column">
          <nav id="top-nav">
            <div>
              <div className="top-nav-item">
                <FileUploader
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  setUploadProgress={setUploadProgress}
                  currentFilePath={currentFilePath}
                />
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
                <p>{currentFilePath}</p>
              </div>
              <div id="file-container-row">
                {Object.keys(currentFileSystem).map((key) => {
                  const currentFile = currentFileSystem[key];
                  return (
                    <FileTile
                      currentFile={currentFile}
                      openFolder={openFolder}
                      key={key}
                      name={key}
                    />
                  );
                })}
                {creatingFolder ? (
                  <div className="folder-container">
                    <div className="folder-item">
                      <div className="file-item-top">
                        <FaFolder type="folder" size="50px" color="#583da1" />
                        {/* <FaFolder size="50px" color="#583da1" /> */}
                        <BsThreeDotsVertical size="25px" color="gray" />
                      </div>
                      <div className="folder-text-container">
                        <form onSubmit={createFolder}>
                          <input
                            type="text"
                            ref={inputRef}
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                          />
                          <button type="submit">Create</button>
                          <button onClick={() => setCreatingFolder(false)}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    id="new-folder"
                    onClick={(e) => {
                      setCreatingFolder(true);
                    }}
                  >
                    <BsFillPlusCircleFill size="80px" color="#52d852" />
                    <p>New Folder</p>
                  </div>
                )}
              </div>
              {isUploading && (
                <div id="upload-status">
                  {Math.round(uploadProgress >= 100) ? (
                    <AiFillCheckCircle size="50px" color="#52d852" />
                  ) : (
                    <FaCloudUploadAlt size="50px" color="#583da1" />
                  )}

                  <div id="upload-status-text">
                    <p>Uploading...</p>
                    <p>{Math.round(uploadProgress)}%</p>
                  </div>
                </div>
              )}
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
