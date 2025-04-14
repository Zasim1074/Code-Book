import { createContext, useEffect, useState } from "react";
import { v4 } from "uuid";

export { PlaygroundContext, PlaygroundProvider, defaultCodes };

const PlaygroundContext = createContext();

const defaultCodes = {
  cpp: `#include <iostream>
using namespace std;
int main() {
  cout << "Hello, CPP!" << endl;
  return 0;
};`,
  python: `print("Hello, Python")`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`,
  javascript: `console.log("Hello, JavaScript");`,
};

const initialData = [
  {
    title: "DSA",
    id: v4(),
    file: [
      {
        title: "Array1D",
        id: v4(),
        language: "cpp",
        code: `cout << "Hello, World!" << endl;`,
      },
      {
        title: "Array2D",
        id: v4(),
        language: "cpp",
        code: `cout << "Hello, World!" << endl;`,
      },
      {
        title: "Arrays",
        id: v4(),
        language: "cpp",
        code: `cout << "Hello, World!" << endl;`,
      },
    ],
  },

  {
    title: "Frontend",
    id: v4(),
    file: [
      {
        title: "Index1",
        id: v4(),
        language: "javascript",
        code: `console.log("Hello, Javascript");`,
      },
      {
        title: "Index2",
        id: v4(),
        language: "javascript",
        code: `console.log("Hello, Javascript");`,
      },
      {
        title: "Index3",
        id: v4(),
        language: "javascript",
        code: `console.log("Hello, Javascript");`,
      },
    ],
  },
];

const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState(() => {
    try {
      const localData = localStorage.getItem("data");
      return localData ? JSON.parse(localData) : initialData;
    } catch (error) {
      console.error("Error parsing local storage data:", error);
      return initialData;
    }
  });

  const createNewPlayground = (newPlayground) => {
    const { folderName, fileName, language } = newPlayground;

    const newFolder = {
      title: folderName,
      id: v4(),
      file: [
        {
          title: fileName,
          id: v4(),
          language,
          code: defaultCodes[language],
        },
      ],
    };

    const newFolders = [...folders, newFolder];
    localStorage.setItem("data", JSON.stringify(newFolders));
    setFolders(newFolders);
  };

  const createNewFolder = (folderName) => {
    const newFolder = {
      id: v4(),
      title: folderName,
      file: [],
    };

    const allFolders = [...folders, newFolder];
    localStorage.setItem("data", JSON.stringify(allFolders));
    setFolders(allFolders);
  };

  const createNewFile = (folderId, card) => {
    const copiedFolders = [...folders];
    for (let i = 0; i < copiedFolders.length; i++) {
      if (copiedFolders[i].id === folderId) {
        copiedFolders[i].file.push({
          ...card,
          code: card.code || defaultCodes[card.language],
        });
        break;
      }
    }

    localStorage.setItem("data", JSON.stringify(copiedFolders));
    setFolders(copiedFolders);
  };

  const deleteFolder = (id) => {
    const updatedFolderList = folders.filter((folderItem) => {
      return folderItem.id !== id;
    });

    localStorage.setItem("data", JSON.stringify(updatedFolderList));
    setFolders(updatedFolderList);
  };

  const deleteFile = (folderId, fileId) => {
    const copiedFolders = [...folders];
    for (let i = 0; i < copiedFolders.length; i++) {
      if (copiedFolders[i].id === folderId) {
        copiedFolders[i].file = copiedFolders[i].file.filter(
          (file) => file.id !== fileId
        );
        break;
      }
    }
    localStorage.setItem("data", JSON.stringify(copiedFolders));
    setFolders(copiedFolders);
  };

  const editFolderTitle = (newFolderName, id) => {
    const updatedFolderList = folders.map((folderItem) => {
      if (folderItem.id === id) {
        folderItem.title = newFolderName;
      }
      return folderItem;
    });

    localStorage.setItem("data", JSON.stringify(updatedFolderList));
    setFolders(updatedFolderList);
  };

  const editFileTitle = (newFileName, folderId, fileId) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          file: folder.file.map((file) =>
            file.id === fileId ? { ...file, title: newFileName } : file
          ),
        };
      }
      return folder;
    });

    localStorage.setItem("data", JSON.stringify(updatedFolders));
    setFolders(updatedFolders);
  };

  const getDefaultCodes = (fileId, folderId) => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].file.length; j++) {
          const currentFile = folders[i].file[j];
          if (currentFile.id === fileId) {
            return currentFile.code || defaultCodes[currentFile.language] || "";
          }
        }
      }
    }
    return "";
  };

  const getLanguage = (fileId, folderId) => {
    const folder = folders.find((folder) => folder.id === folderId);
    if (!folder) {
      return console.log("Folder not found");
    }

    const file = folder.file.find((file) => file.id === fileId);
    if (!file) {
      return console.log("File not found");
    }

    return file.language;
  };

  const getFileTitle = (fileId, folderId) => {
    const folder = folders.find((folder) => folder.id === folderId);
    if (!folder) {
      return console.log("Folder not found");
    }

    const file = folder.file.find((file) => file.id === fileId);
    if (!file) {
      return console.log("File not found");
    }

    return file.title;
  };

  const updateLanguage = (fileId, folderId, language) => {
    const newFolders = [...folders];
    for (let i = 0; i < newFolders.length; i++) {
      if (newFolders[i].id === folderId) {
        for (let j = 0; j < newFolders[i].file.length; j++) {
          if (newFolders[i].file[j].id === fileId) {
            if (!newFolders[i].file[j].code) {
              newFolders[i].file[j].code = defaultCodes[language] || "";
            }
            newFolders[i].file[j].language = language;
            setFolders(newFolders);
            localStorage.setItem("data", JSON.stringify(newFolders));
            return;
          }
        }
      }
    }
    console.log("File or folder not found");
  };

  const saveCode = (fileId, folderId, newCode) => {
    const newFolders = [...folders];
    for (let i = 0; i < newFolders.length; i++) {
      if (newFolders[i].id === folderId) {
        for (let j = 0; j < newFolders[i].file.length; j++) {
          const currentFile = newFolders[i].file[j];
          if (currentFile.id === fileId) {
            newFolders[i].file[j].code = newCode;
          }
        }
      }
    }
    setFolders(newFolders);
    localStorage.setItem("data", JSON.stringify(newFolders));
  };

  useEffect(() => {
    const localData = localStorage.getItem("data");
    if (localData) {
      setFolders(JSON.parse(localData));
    } else {
      localStorage.setItem("data", JSON.stringify(initialData));
      setFolders(initialData);
    }
  }, []);

  const playgroundFeatures = {
    folders,
    createNewPlayground,
    createNewFolder,
    deleteFolder,
    editFolderTitle,
    editFileTitle,
    deleteFile,
    createNewFile,
    getDefaultCodes,
    getLanguage,
    updateLanguage,
    saveCode,
    getFileTitle,
  };

  return (
    <PlaygroundContext.Provider value={playgroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};
