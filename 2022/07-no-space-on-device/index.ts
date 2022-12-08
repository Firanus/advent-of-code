import path from "path";
import fs from "fs";

type Document = { type: "DOC"; name: string; size: number };
type FileSystem = {
  type: "FS";
  name: string;
  files: (Document | FileSystem)[];
  parent?: FileSystem;
  size?: number;
};

const isFileSystem = (obj: Document | FileSystem): obj is FileSystem => {
  return obj.type === "FS";
};

const fillInSizes = (fileSystem: FileSystem): number => {
  fileSystem.size = fileSystem.files.reduce((acc, curr) => {
    if (!isFileSystem(curr)) {
      return acc + curr.size;
    }

    return acc + fillInSizes(curr);
  }, 0);

  return fileSystem.size;
};

const getAllDirectories = (fileSystem: FileSystem): FileSystem[] => {
  const files: FileSystem[] = [];
  files.push(fileSystem);

  fileSystem.files.forEach((file) => {
    if (!isFileSystem(file)) {
      return;
    }

    const eligibleFiles = getAllDirectories(file);
    files.push(...eligibleFiles);
  });

  return files;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const consoleInstructions = data.split("\n");
    const rootFileSystem: FileSystem = { type: "FS", name: "/", files: [] };

    let currentFileSystem = rootFileSystem;
    for (let i = 0; i < consoleInstructions.length; i++) {
      const currentInstruction = consoleInstructions[i];

      if (currentInstruction.startsWith("dir")) {
        const [_, dirName] = currentInstruction.split(" ");

        // Do I need to dedupe here? Not for this input.
        currentFileSystem.files.push({
          type: "FS",
          name: dirName,
          files: [],
          parent: currentFileSystem,
        });
      } else if (currentInstruction.startsWith("$ ls")) {
        continue;
      } else if (currentInstruction === "$ cd ..") {
        if (!currentFileSystem.parent) {
          throw new Error(
            "Trying to leave directory with no parent. This should not be possible"
          );
        }
        currentFileSystem = currentFileSystem.parent;
      } else if (currentInstruction === "$ cd /") {
        currentFileSystem = rootFileSystem;
      } else if (currentInstruction.startsWith("$ cd")) {
        const directoryName = currentInstruction.replace("$ cd ", "");
        const targetDirectory = currentFileSystem.files.find(
          (x) => x.name === directoryName
        );
        if (!targetDirectory || !isFileSystem(targetDirectory)) {
          throw new Error(
            "Trying to navigate into something that is not a file system. This should not be possible"
          );
        }

        currentFileSystem = targetDirectory;
      } else {
        const [fileSize, docName] = currentInstruction.split(" ");
        currentFileSystem.files.push({
          type: "DOC",
          name: docName,
          size: parseInt(fileSize, 10),
        });
      }
    }

    fillInSizes(rootFileSystem);

    const allDirectories = getAllDirectories(rootFileSystem).sort(
      (a, b) => (a.size ?? 0) - (b.size ?? 0)
    );
    const indexOfFirstDirectoryOver100000 = allDirectories.findIndex(
      (x) => (x.size ?? 0) > 100000
    );
    const part1Solution = allDirectories
      .slice(0, indexOfFirstDirectoryOver100000)
      .reduce((acc, curr) => acc + (curr.size ?? 0), 0);

    const totalSize = 70000000;
    const minimumNeededFreeSize = 30000000;
    const currentFreeSize =
      totalSize - (allDirectories[allDirectories.length - 1].size ?? 0);
    const minimumDirectorySizeToDelete =
      minimumNeededFreeSize - currentFreeSize;

    const directoryToDelete = allDirectories.find(
      (x) => (x.size ?? 0) > minimumDirectorySizeToDelete
    );

    console.log("Part 1 Solution:", part1Solution);
    console.log("Part 2 Solution:", directoryToDelete?.size);
  }
);
