import React, { useContext } from "react";
import { modalConstants, ModalContext } from "../ModalProvider";
import { CreatePlaygroundModal } from "./CreatePlaygroundModal";
import { CreateFolderModal } from "./CreateFolderModal";
import { UpdateFolderTitleModal } from "./UpdateFolderTitleModal";
import { UpdateFileTitleModal } from "./UpdateFileTitleModal";
import { CreateCardModal } from "./CreateCardModal";

export const Modal = () => {
  const modalFeatures = useContext(ModalContext);

  return (
    <>
      {modalFeatures.activeModal === modalConstants.CREATE_PLAYGROUND &&  <CreatePlaygroundModal />}
      {modalFeatures.activeModal === modalConstants.CREATE_FOLDER && <CreateFolderModal />}
      {modalFeatures.activeModal === modalConstants.UPDATE_FOLDER_TITLE && <UpdateFolderTitleModal/>}
      {modalFeatures.activeModal === modalConstants.UPDATE_FILE_TITLE && <UpdateFileTitleModal />}
      {modalFeatures.activeModal === modalConstants.ADD_NEW_FILE && <CreateCardModal />}
    </>
  );
};
