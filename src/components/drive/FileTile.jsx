import React from "react";
import pdfIcon from "../../icons/pdf-icon.svg";
import folderIcon from "../../icons/folder-icon.svg";
import imgIcon from "../../icons/jpeg-icon.svg";
import { FaFolder } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscFilePdf } from "react-icons/vsc";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiMoviePlay } from "react-icons/bi";
import "../../styles/FileTile.css";

const FileIcon = ({ type, size, color }) => {
  const icons = {
    pdf: VscFilePdf,
    folder: FaFolder,
    jpeg: MdOutlinePhotoSizeSelectActual,
    png: MdOutlinePhotoSizeSelectActual,
    jpg: MdOutlinePhotoSizeSelectActual,
    pages: IoDocumentTextOutline,
    doc: IoDocumentTextOutline,
    docx: IoDocumentTextOutline,
    txt: IoDocumentTextOutline,
    mov: BiMoviePlay,
    mp4: BiMoviePlay,
  };

  const IconComponent = icons[type];

  return <IconComponent size={size} color={color} />;
};

const FileTile = ({ currentFile, openFolder, name }) => {
  if (currentFile.isFolder) {
    return (
      <div
        className="folder-container"
        onDoubleClick={() => openFolder(currentFile, name)}
      >
        <div className="folder-item">
          <div className="file-item-top">
            <FileIcon type="folder" size="50px" color="#583da1" />
            {/* <FaFolder size="50px" color="#583da1" /> */}
            <BsThreeDotsVertical size="25px" color="gray" />
          </div>
          <div className="folder-text-container">
            <p className="file-name">{name}</p>
            <p className="file-subtext">
              {currentFile.__data.lastModified.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="file-item-container">
        <div className="file-item">
          <div className="file-item-top">
            <FileIcon type={currentFile.fileType} size="50px" color="gray" />

            <BsThreeDotsVertical size="25px" color="gray" />
          </div>

          <p className="file-name">{name}</p>
          <p className="file-subtext">
            {currentFile.__data.lastModified.toLocaleString()}
          </p>
        </div>
        <p>
          {currentFile.__data.size / 1000 > 1000
            ? `${(currentFile.__data.size / 1000000).toFixed(2)} MB`
            : `${(currentFile.__data.size / 1000).toFixed(2)} KB`}
        </p>
      </div>
    );
  }
};

export default FileTile;
