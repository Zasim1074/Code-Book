import { useContext, useState } from "react";
import "./CreatePlaygroundModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProviders";

export const CreatePlaygroundModal = () => {
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("cpp");

  const modalFeatures = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onChangeFolder = (event) => {
    setFolderName(event.target.value);
  };

  const onChangeFile = (event) => {
    setFileName(event.target.value);
  };

  const onChangeLanguage = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    return newLang;
  };

  const onSubmitModal = (event) => {
    event.preventDefault();
    playgroundFeatures.createNewPlayground({
      folderName,
      fileName,
      language,
    });
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <div className="items">
          <span onClick={closeModal} className="material-symbols-outlined">
            close
          </span>
          <h2>Create a new Folder & File</h2>
        </div>

        <div className="items">
          <p>Enter Folder Name:</p>
          <input
            required
            type="text"
            value={folderName}
            onChange={onChangeFolder}
            placeholder="FolderName"
          />
        </div>

        <div className="items">
          <p>Enter File Name:</p>
          <input
            required
            type="text"
            value={fileName}
            onChange={onChangeFile}
            placeholder="fileName.language"
          />
        </div>

        <div className="items">
          <select value={language} onChange={onChangeLanguage}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JS</option>
          </select>
          <button type="submit">Create Folder</button>
        </div>
      </form>
    </div>
  );
};
