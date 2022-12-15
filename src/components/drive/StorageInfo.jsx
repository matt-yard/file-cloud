import React from "react";
import "../../styles/StorageInfo.css";

const StorageInfo = ({ storage: { totalStorage, storageBreakdown } }) => {
  console.log("Storage info rendering!!!");
  console.log("storage breakdown inside StorageInfo", storageBreakdown);
  return (
    <div id="storage-info-container">
      <h1>Storage Breakdown</h1>
      <p>Total Storage: {totalStorage} MB / 100 MB</p>
      {Object.keys(storageBreakdown).map((fileType) => {
        return (
          <p key={fileType}>
            {fileType.toUpperCase()}: {storageBreakdown[fileType]} MB
          </p>
        );
      })}
    </div>
  );
};

export default StorageInfo;
