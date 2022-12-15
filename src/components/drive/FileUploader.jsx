import React, { useRef } from "react";
import { processStorageList } from "../../util";
import { Storage } from "aws-amplify";
import { FaCloudUploadAlt } from "react-icons/fa";

const FileUploader = ({
  currentFilePath,
  setFileSystem,
  setTotalStorage,
  setStorageBreakdown,
}) => {
  const hiddenUploader = useRef(null);

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
        <p>Add File</p>
      </div>
    </>
  );
};

export default FileUploader;
