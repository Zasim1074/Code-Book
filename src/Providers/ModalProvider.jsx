import { createContext, useState } from "react";

export const ModalContext = createContext();

export const modalConstants = {
  CREATE_PLAYGROUND: "CREATE_PLAYGROUND",
  CREATE_FOLDER: "CREATE_FOLDER",
  UPDATE_FOLDER_TITLE: "UPDATE_FOLDER_TITLE",
  UPDATE_FILE_TITLE: "UPDATE_FILE_TITLE",
  ADD_NEW_FILE: "ADD_NEW_FILE",
  SHOW_AI: "SHOW_AI"
};

export const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [modalPayload, setModalPayLoad] = useState(null);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setModalPayLoad(null);
  };

  const modalFeatures = {
    openModal,
    closeModal,
    activeModal: modalType,
    modalPayload,
    setModalPayLoad,
  };

  return (
    <>
      <ModalContext.Provider value={modalFeatures}>
        {children}
      </ModalContext.Provider>
    </>
  );
};
