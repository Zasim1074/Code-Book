import { useContext, useState } from "react";
import "./CreateFolderModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProviders";

export const CreateFolderModal = () => {
  const [folderName, setFolderName] = useState("");

  const modalFeatures = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);
  const { createNewFolder } = useContext(PlaygroundContext);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onChangeFolder = (event) => {
    setFolderName(event.target.value);
  };

  const onSubmitModal = (event) => {
    event.preventDefault();
    playgroundFeatures.createNewFolder(folderName);
    closeModal();
  };

  return (
    <div className="folder-Modal-container">
      <form className="folder-Modal-body" onSubmit={onSubmitModal}>
        <div className="items">
          <span className="material-symbols-outlined" onClick={closeModal}>
            close
          </span>
          <h2>Create New Folder</h2>
        </div>

        <div className="items">
          <input
            required
            type="text"
            value={folderName}
            onChange={onChangeFolder}
            placeholder="FolderName"
          />

          <button type="submit">Create Folder</button>
        </div>
      </form>
    </div>
  );
};
