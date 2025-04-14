import { useContext, useState } from "react";
import "./CreateCardModal.scss";
import { ModalContext } from "../ModalProvider";
import { defaultCodes, PlaygroundContext } from "../PlaygroundProviders";
import { v4 } from "uuid";

export const CreateCardModal = () => {
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("cpp");

  const modalFeatures = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);
  const { createNewFile } = useContext(PlaygroundContext);
  const { modalPayload } = useContext(ModalContext);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onChangeFile = (event) => {
    setFileName(event.target.value);
  };

  const onChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const onSubmitModal = (event) => {
    event.preventDefault();
    const file = {
      title: fileName,
      id: v4(),
      language,
      code: defaultCodes[language],
    };

    playgroundFeatures.createNewFile(modalPayload, file);
    closeModal();
  };

  return (
    <div className="card-Modal-container">
      <form className="card-Modal-body" onSubmit={onSubmitModal}>
        <div className="items">
          <span onClick={closeModal} className="material-symbols-outlined">
            close
          </span>
          <h2>Create New File</h2>
        </div>

        <div className="items">
          <input
            required
            type="text"
            value={fileName}
            onChange={onChangeFile}
            placeholder="File Name"
          />
          <select value={language} onChange={onChangeLanguage}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JS</option>
          </select>
        </div>

        <button type="submit">Create File</button>
      </form>
    </div>
  );
};
