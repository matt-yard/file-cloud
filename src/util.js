export const processStorageList = (files) => {
  console.log("files to be parsed", files);
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

  for (const key in storageBreakdown) {
    storageBreakdown[key] = (storageBreakdown[key] * 0.000001).toFixed(2);
  }

  return {
    parsedFiles: fileSystem,
    totalStorageUsed: (totalStorageUsed * 0.000001).toFixed(2),
    storageBreakdown,
  };
};

// export const processStorageList = (response) => {
//   const filesystem = {};
//   // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
//   const add = (source, target, item) => {
//     const elements = source.split("/");
//     const element = elements.shift();
//     if (!element) return; // blank
//     target[element] = target[element] || { __data: item }; // element;
//     if (elements.length) {
//       target[element] =
//         typeof target[element] === "object" ? target[element] : {};
//       add(elements.join("/"), target[element], item);
//     }
//   };
//   response.forEach((item) => add(item.key, filesystem, item));
//   return { parsedFiles: filesystem };
// };
