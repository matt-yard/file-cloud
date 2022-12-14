import React from "react";
import "../../styles/StorageInfo.css";
import { FaCircle } from "react-icons/fa";
import StorageChart from "./StorageChart";
import { colors } from "../../util";

const StorageInfo = ({ storage: { totalStorage, storageBreakdown } }) => {
  return (
    <div id="storage-info-container">
      <h1>Storage Breakdown</h1>
      <div className="chart-container">
        <StorageChart
          storageBreakdown={storageBreakdown}
          totalStorage={totalStorage}
        />
      </div>
      <div id="total-storage">
        <p id="main-storage-number">{totalStorage} MB</p>
        <p>Used of 100 MB</p>
      </div>
      <div id="storage-legend">
        {Object.keys(storageBreakdown).map((fileType) => {
          return (
            <div className="storage-key" key={fileType}>
              <FaCircle size="20px" color={colors[fileType]} />
              <p>
                {fileType}: {storageBreakdown[fileType]} MB
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorageInfo;
