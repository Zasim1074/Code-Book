import { useContext, useState } from "react";
import "./UpdateFolderTitleModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProviders";

export const UpdateFolderTitleModal = () => {
  const [folderName, setFolderName] = useState("");

  const modalFeatures = useContext(ModalContext);
  const {modalPayload} = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);
  const {editFolderTitle} = useContext(PlaygroundContext);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onChangeFolder = (event) => {
    setFolderName(event.target.value);
  };

  const onSubmitModal = (event) => {
    event.preventDefault();
    playgroundFeatures.editFolderTitle(folderName, modalPayload);
    closeModal();
  };

  return (
    <div className="edit-Folder-Modal-container">
      <form className="edit-Folder-Modal-body" onSubmit={onSubmitModal}>
        <div className="items">
          <span className="material-symbols-outlined" onClick={closeModal}>
            close
          </span>
          <h2>Edit Folder Name</h2>
        </div>

        <div className="items">
          <input
          required
            type="text"
            value={folderName}
            onChange={onChangeFolder}
            placeholder="New Folder Name"
          />

          <button type="submit">Update Folder</button>
        </div>
      </form>
    </div>
  );
};
