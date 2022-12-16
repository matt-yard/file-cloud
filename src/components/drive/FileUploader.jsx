import React, { useRef } from "react";
import { processStorageList } from "../../util";
import { Storage } from "aws-amplify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const FileUploader = ({
  setIsUploading,
  setUploadProgress,
  currentFilePath,
}) => {
  const { setFileSystem, setTotalStorage, setStorageBreakdown, totalStorage } =
    useOutletContext();

  const hiddenUploader = useRef(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const newFileSize = parseFloat((file.size * 0.000001).toFixed(2));

    if (newFileSize + totalStorage > 100) {
      toast.error("Upload Failed: Not Enough Storage", {
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
      try {
        setIsUploading(true);
        const uploadUrl = currentFilePath + file.name;

        await Storage.put(uploadUrl, file, {
          progressCallback(progress) {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });
        setTimeout(() => {
          setIsUploading(false);
        }, 3000);

        const result = await Storage.vault.list("");
        const { parsedFiles, totalStorageUsed, storageBreakdown } =
          processStorageList(result);

        // let [currentFolderName] = Object.keys(parsedFiles);
        // const newFileSystem = parsedFiles[currentFolderName];
        // delete newFileSystem.__data;
        // delete newFileSystem.isFolder;
        setFileSystem(parsedFiles);
        setTotalStorage(totalStorageUsed);
        setStorageBreakdown(storageBreakdown);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    }
  };

  const handleClick = (e) => {
    hiddenUploader.current.click();
  };
  return (
    <>
      <input
        type="file"
        ref={hiddenUploader}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div onClick={handleClick} id="file-uploader">
        <FaCloudUploadAlt size="30px" color="#583da1" />
        <p>Upload File</p>
      </div>
    </>
  );
};

export default FileUploader;
