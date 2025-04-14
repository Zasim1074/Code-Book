import { useContext } from "react";
import { Modal } from "../../Providers/Modals/Modal";
import "./index.scss";
import logo from "./logo.png";
import { RightComponent } from "./Right Component";
import { modalConstants, ModalContext } from "../../Providers/ModalProvider";

export const HomeScreen = () => {
  const modalFeatures = useContext(ModalContext);

  const openCreatePlaygroundModal = () => {
    modalFeatures.openModal(modalConstants.CREATE_PLAYGROUND);
  };

  return (
    <div className="home-container">
      <div className="left-container">
        <div className="items-container">
          <img id="img-logo" src={logo} alt="Logo" />
          <h1>Code Book</h1>
          <h2>Code.Compile.Debug</h2>
          <button onClick={openCreatePlaygroundModal}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "30px"}}
            >
              add
            </span>
            <span>Create Project</span>
          </button>
        </div>
      </div>

      <RightComponent />
      <Modal />
    </div>
  );
};
