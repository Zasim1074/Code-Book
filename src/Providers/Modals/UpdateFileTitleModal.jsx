import { useContext, useState } from "react";
import "./UpdateFileTitleModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProviders";

export const UpdateFileTitleModal = () => {
  const [fileName, setFileName] = useState("");

  const modalFeatures = useContext(ModalContext);
  const {modalPayload} = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);
  const {editFileTitle} = useContext(PlaygroundContext);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onChangeFile = (event) => {
    setFileName(event.target.value);
  };

  const onSubmitModal = (event) => {
    event.preventDefault();
    playgroundFeatures.editFileTitle(fileName, modalPayload.folderId, modalPayload.fileId);
    closeModal();
  };

  return (
    <div className="edit-File-Modal-container">
      <form className="edit-File-Modal-body" onSubmit={onSubmitModal}>
        <div className="items">
          <span className="material-symbols-outlined" onClick={closeModal}>
            close
          </span>
          <h2>Edit File Name</h2>
        </div>

        <div className="items">
          <input
          required
            type="text"
            value={fileName}
            onChange={onChangeFile}
            placeholder="New File Name"
          />

          <button type="submit">Update File</button>
        </div>
      </form>
    </div>
  );
};
