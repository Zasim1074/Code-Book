import { useContext } from "react";
import "./index.scss";
import logo from "./logo.png";
import { modalConstants, ModalContext } from "../../../Providers/ModalProvider";
import { PlaygroundContext } from "../../../Providers/PlaygroundProviders";
import { useNavigate } from "react-router-dom";

const Folder = ({ folderTitle, cards, folderId }) => {
  const { deleteFolder, deleteFile } = useContext(PlaygroundContext);
  const { openModal, setModalPayLoad } = useContext(ModalContext);
  let navigate = useNavigate();

  const onDeleteFolder = () => {
    deleteFolder(folderId);
  };

  const onEditFolderTitle = () => {
    setModalPayLoad(folderId);
    openModal(modalConstants.UPDATE_FOLDER_TITLE);
  };

  const onCreateNewFile = () => {
    setModalPayLoad(folderId);
    openModal(modalConstants.ADD_NEW_FILE);
  };

  return (
    <div className="folder-container">
      {/*DSA Folder*/}
      <div className="header">
        <div className="title">
          <span
            className="material-symbols-outlined"
            data-content="folder_open"
            style={{ color: " #FF9F00", fontSize: "28px" }}
          >
            folder_open
          </span>
          &nbsp;
          <span>{folderTitle}</span>
        </div>

        <div className="options">
          <button>
            <span
              className="material-symbols-outlined"
              onClick={onEditFolderTitle}
            >
              edit
            </span>
          </button>
          <button>
            <span
              className="material-symbols-outlined"
              onClick={onDeleteFolder}
            >
              delete
            </span>
          </button>

          <button id="btn-new-playground" onClick={onCreateNewFile}>
            <span
              className="material-symbols-outlined"
              data-content="folder_open"
              style={{ fontSize: "28px" }}
            >
              add
            </span>
            <span style={{ fontSize: "16px" }}>New File</span>
          </button>
        </div>
      </div>

      <div className="cards-container">
        {cards?.map((file, index) => {
          const onEditFileTitle = () => {
            setModalPayLoad({ fileId: file.id, folderId: folderId });
            openModal(modalConstants.UPDATE_FILE_TITLE);
          };

          const onDeleteFile = () => {
            deleteFile(folderId, file.id);
          };

          const navigateToPlaygroundScreen = () => {
            navigate(`/playground/${file.id}/${folderId}`);
          };

          return (
            <div className="card" key={index}>
              <img
                src={logo}
                alt="logo"
                onClick={navigateToPlaygroundScreen}
              ></img>
              <div className="card-items">
                <div>
                  <span>{file?.title}</span>
                  <br></br>
                  <span>Language: {file?.language}</span>
                </div>
                &nbsp;&nbsp;
                <div>
                  <button>
                    <span
                      className="material-symbols-outlined"
                      onClick={onEditFileTitle}
                    >
                      edit
                    </span>
                  </button>
                  &nbsp;
                  <button>
                    <span
                      className="material-symbols-outlined"
                      onClick={onDeleteFile}
                    >
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RightComponent = () => {
  const { folders } = useContext(PlaygroundContext);
  const modalFeatures = useContext(ModalContext);

  const openCreateNewFolderModal = () => {
    modalFeatures.openModal(modalConstants.CREATE_FOLDER);
  };

  return (
    <div className="right-container">
      <div className="header">
        <div className="title">
          <span>My </span>Projects
        </div>
        <button className="create-folder" onClick={openCreateNewFolderModal}>
          <span
            className="material-symbols-outlined"
            data-content="folder_open"
            style={{ fontSize: "28px" }}
            >
            add
          </span>
          <span style={{ fontSize: "16px" }}>New Folder</span>
        </button>
      </div>

      {folders?.map((folder, index) => {
        return (
          <Folder
            folderTitle={folder.title}
            cards={folder.file}
            key={index}
            folderId={folder.id}
          />
        );
      })}
    </div>
  );
};
