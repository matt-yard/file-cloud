import React, { useState } from "react";
import { BsThreeDotsVertical, BsFillTrashFill } from "react-icons/bs";
import { BiDownload } from "react-icons/bi";
import { Storage } from "aws-amplify";
import "../../styles/FileTile.css";
import { useOutletContext } from "react-router-dom";
import { processStorageList, getMediaType, colors } from "../../util";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { icons } from "../../util";

const FileIcon = ({ type, size }) => {
  const IconComponent = icons[type] || icons.default;

  const mediaType = getMediaType(type);

  const color = colors[mediaType];

  return <IconComponent size={size} color={color} />;
};

const FileTile = ({ currentFile, openFolder, name }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { setFileSystem, setTotalStorage, setStorageBreakdown } =
    useOutletContext();
  const [downloadLink, setDownloadLink] = useState("");
  // console.log(currentFile);

  useEffect(() => {
    const getDownloadLink = async () => {
      const result = await Storage.get(currentFile.__data.key);
      setDownloadLink(result);
    };
    getDownloadLink();
  }, []);

  const handleDelete = async (e) => {
    setShowTooltip(false);
    try {
      if (Object.keys(currentFile).length > 2) {
        toast.error("Folder couldn't be deleted because it isn't empty.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        let fileNameToDelete = currentFile.__data.key;

        await Storage.remove(fileNameToDelete);

        const result = await Storage.vault.list("");
        console.log("result after delete", result);
        const { parsedFiles, totalStorageUsed, storageBreakdown } =
          processStorageList(result);
        console.log("parsed files after delete", parsedFiles);

        setFileSystem(parsedFiles);

        setTotalStorage(totalStorageUsed);
        setStorageBreakdown(storageBreakdown);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async (e) => {
    setShowTooltip(false);
    try {
      const result = await Storage.get(currentFile.__data.key, {
        download: true,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  if (currentFile.isFolder) {
    return (
      <div className="container-with-tooltip">
        <div
          className="folder-container"
          onDoubleClick={() => openFolder(currentFile, name)}
        >
          <div className="folder-item">
            <div className="file-item-top">
              <FileIcon type="folder" size="50px" color="#583da1" />
              {/* <FaFolder size="50px" color="#583da1" /> */}
              <BsThreeDotsVertical
                size="25px"
                color="gray"
                className="more-options"
                onClick={() => setShowTooltip(!showTooltip)}
              />
            </div>
            <div className="folder-text-container">
              <p className="file-name">
                {name.length > 20
                  ? `${name.slice(0, 10)}...${name.slice(-10)}`
                  : name}
              </p>
              <p className="file-subtext">{currentFile.__data.lastModified}</p>
            </div>
          </div>
        </div>
        {showTooltip && (
          <div className="tooltip-wrapper">
            <div
              className="tooltip-tip"
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="tooltip-option" onClick={handleDownload}>
                <BiDownload size="20px" />
                <p>
                  <a href={downloadLink} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </p>
              </div>
              <div className="tooltip-option" onClick={handleDelete}>
                <BsFillTrashFill size="20px" color="red" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="container-with-tooltip">
        <div className="file-item-container">
          <div className="file-item">
            <div className="file-item-top">
              <FileIcon type={currentFile.fileType} size="50px" />

              <BsThreeDotsVertical
                size="25px"
                color="gray"
                className="more-options"
                onClick={() => setShowTooltip(!showTooltip)}
              />
            </div>

            <p className="file-name">
              {name.length > 20
                ? `${name.slice(0, 10)}...${name.slice(-10)}`
                : name}
            </p>
            <p className="file-subtext">
              {currentFile?.__data?.lastModified.toLocaleString()}
            </p>
          </div>
          <p>
            {currentFile?.__data?.size / 1000 > 1000
              ? `${(currentFile?.__data?.size / 1000000).toFixed(2)} MB`
              : `${(currentFile?.__data?.size / 1000).toFixed(2)} KB`}
          </p>
        </div>
        {showTooltip && (
          <div className="tooltip-wrapper">
            <div
              className="tooltip-tip"
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="tooltip-option" onClick={handleDownload}>
                <BiDownload size="20px" color="#583da1" />
                <p>
                  <a href={downloadLink} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </p>
              </div>
              <div className="tooltip-option" onClick={handleDelete}>
                <BsFillTrashFill size="20px" color="red" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default FileTile;
