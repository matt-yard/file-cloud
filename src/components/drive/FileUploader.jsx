import React, { useRef } from "react";
import { processStorageList } from "../../util";
import { Storage } from "aws-amplify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const FileUploader = ({ setIsUploading, setUploadProgress }) => {
  const {
    currentFilePath,
    setFileSystem,
    setTotalStorage,
    setStorageBreakdown,
    totalStorage,
  } = useOutletContext();

  const hiddenUploader = useRef(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    console.log("file from uploader", file);
    if ((file.size * 0.000001).toFixed(2) + totalStorage > 100) {
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
        await Storage.put(
          `${currentFilePath ? currentFilePath : ""}${file.name}`,
          file,
          {
            progressCallback(progress) {
              setUploadProgress((progress.loaded / progress.total) * 100);
              console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
            },
          }
        );
        setTimeout(() => {
          setIsUploading(false);
        }, 5000);
        const result = await Storage.vault.list("");
        if (result.length) {
          const { parsedFiles, totalStorageUsed, storageBreakdown } =
            processStorageList(result);
          setFileSystem(parsedFiles);
          setTotalStorage(totalStorageUsed);
          setStorageBreakdown(storageBreakdown);
        }
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
