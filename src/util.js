export const processStorageList = (files) => {
  const fileSystem = {};

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
      let fileType = item.key.split(".")[1];
      target[element] = { ...target[element], fileType };
    }
  };
  files.forEach((item) => add(item.key, fileSystem, item));
  return fileSystem;
};
