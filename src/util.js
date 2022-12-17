export const processStorageList = (files) => {
  const fileSystem = {};
  let totalStorageUsed = 0;
  const storageBreakdown = {};

  const add = (source, target, item) => {
    const elements = source.split("/");
    const element = elements.shift();

    if (!element) return;

    target[element] = target[element] || { __data: item };

    if (elements.length) {
      target[element] =
        typeof target[element] === "object"
          ? { ...target[element], isFolder: true }
          : {};

      add(elements.join("/"), target[element], item);
    } else {
      const splitTypes = item.key.split(".");
      let fileType = splitTypes[splitTypes.length - 1];

      target[element].fileType = fileType;

      totalStorageUsed += item.size;
      if (storageBreakdown[fileType]) {
        storageBreakdown[fileType] += item.size;
      } else {
        storageBreakdown[fileType] = item.size;
      }
    }
  };
  files.forEach((item) => add(item.key, fileSystem, item));
  const storageBreakdownByCategory = {};
  for (const key in storageBreakdown) {
    const legend = {
      mp4: "Video",
      mov: "Video",
      mp3: "Audio",
      wav: "Audio",
      m4a: "Audio",
      jpg: "Photo",
      jpeg: "Photo",
      png: "Photo",
      raw: "Photo",
      gif: "Photo",
    };
    let currentCategory = legend[key];
    if (!currentCategory) {
      if (storageBreakdownByCategory.Documents) {
        storageBreakdownByCategory.Documents += storageBreakdown[key];
      } else {
        storageBreakdownByCategory.Documents = storageBreakdown[key];
      }
    } else {
      if (storageBreakdownByCategory[currentCategory]) {
        storageBreakdownByCategory[currentCategory] += storageBreakdown[key];
      } else {
        storageBreakdownByCategory[currentCategory] = storageBreakdown[key];
      }
    }
    // storageBreakdown[key] = (storageBreakdown[key] * 0.000001).toFixed(2);
  }

  for (const key in storageBreakdownByCategory) {
    let num = parseFloat(
      (storageBreakdownByCategory[key] * 0.000001).toFixed(2)
    );
    storageBreakdownByCategory[key] = num;
  }

  return {
    parsedFiles: fileSystem,
    totalStorageUsed: (totalStorageUsed * 0.000001).toFixed(2),
    storageBreakdown: storageBreakdownByCategory,
  };
};

export const deepClone = (obj) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === "object"
          ? obj[key] instanceof Date
            ? obj[key].toLocaleString()
            : deepClone(obj[key])
          : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

// export const getFolderContents = (folderName, fileSystem) => {
//   let newFileSystem = deepClone(fileSystem)[folderName];
//   delete newFileSystem.__data;
//   delete newFileSystem.isFolder;

//   return newFileSystem;
// };

export const navigateToFolder = (path, fileSystem) => {
  let newFileSystem = deepClone(fileSystem);
  const splitPath = path.split("/");

  splitPath.forEach((folder) => {
    if (folder) {
      newFileSystem = newFileSystem[folder];
      delete newFileSystem.__data;
      delete newFileSystem.isFolder;
    }
  });

  return newFileSystem;
};
