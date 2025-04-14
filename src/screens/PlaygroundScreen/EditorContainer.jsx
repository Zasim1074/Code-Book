import "./EditorContainer.scss";
import logo from "./logo.png";
import { Editor } from "@monaco-editor/react";
import { useContext, useRef, useState, useEffect, createContext } from "react";
import {
  defaultCodes,
  PlaygroundContext,
} from "../../Providers/PlaygroundProviders";

const editorOptions = {
  fontSize: 14,
  padding: { top: 10, bottom: 10 },
  lineNumbersMinChars: 5,
  overviewRulerLanes: 0,
  renderLineHighlight: "none",
};

const fileExtensionMapping = {
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
};

const themeOptions = [
  { value: "vs", label: "VS Light" },
  { value: "vs-dark", label: "VS Dark" },
  { value: "githubDark", label: "GitHub Dark" },
  { value: "githubLight", label: "GitHub Light" },
  { value: "bespin", label: "Bespin" },
  { value: "dracula", label: "Dracula" },
];

export const EditorContainer = ({ fileId, folderId, runCode }) => {
  const {
    getDefaultCodes,
    getLanguage,
    updateLanguage,
    saveCode,
    getFileTitle,
  } = useContext(PlaygroundContext);

  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState(() => getLanguage(fileId, folderId));
  const [code, setCode] = useState(() => getDefaultCodes(fileId, folderId));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fileName, setFileName] = useState("Untitled");

  const codeRef = useRef(code);

  const onImportCode = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ["js", "java", "py", "cpp"];

    const fileExtension = file.name.split(".").pop();

    if (allowedExtensions.includes(fileExtension)) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (value) {
        setCode(value.target.result);
        codeRef.current = value.target.result;
      };
    } else {
      alert("Please choose a valid code file (.js, .java, .py, .cpp).");
    }
  };

  const onExportCode = () => {
    const codeValue = codeRef.current?.trim();
    if (!codeValue) {
      alert("Please write some code before exporting.");
      return;
    }

    const mimeType = `text/${fileExtensionMapping[language] || "plain"}`;
    const codeBlob = new Blob([codeValue], { type: mimeType });
    const downloadUrl = URL.createObjectURL(codeBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `code.${fileExtensionMapping[language]}`;
    link.click();
  };

  const onSaveCode = () => {
    saveCode(fileId, folderId, codeRef.current);
    alert("code saved successfully");
  };

  const onChangeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    const newCode = defaultCodes[selectedLanguage] || "";
    setCode(newCode);
    codeRef.current = newCode;
    updateLanguage(fileId, folderId, selectedLanguage);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    if (!isFullScreen) {
      console.log("Inside the fullscreen.");
    } else {
      console.log("Exit from the fullscreen");
    }
  };

  const onRunCode = () => {
    if (!codeRef.current?.trim()) {
      alert("Cannot run empty code!");
      return;
    }

    if (!fileExtensionMapping[language]) {
      alert("Invalid language selected!");
      return;
    }

    runCode({ code: codeRef.current, language });
  };

  const onshowChatbot = () => {
    onhandleOpen();
  };

  const onChangeTheme = (event) => {
    setTheme(event.target.value);
  };

  const handleEditorChange = (value) => {
    setCode(value);
    codeRef.current = value;
  };

  useEffect(() => {
    setCode(getDefaultCodes(fileId, folderId));
    setFileName(getFileTitle(fileId, folderId));
  }, [fileId, folderId]);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("githubDark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ background: "0d1117" }],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
      },
    });

    monaco.editor.defineTheme("githubLight", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#24292e",
      },
    });

    monaco.editor.defineTheme("bespin", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#28211c",
        "editor.foreground": "#9d9b97",
      },
    });

    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
      },
    });
  };

  return (
    <div
      className={`editor-container ${
        isFullScreen ? "fullscreen" : "smallScreen"
      }`}
    >
      <div className="file-functions">
        <div className="func">
          <img src={logo} alt="Logo" />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className="titleEdit">
            <h2>{fileName || "Default Title"}</h2>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={onSaveCode}>Save Code</button>
        </div>

        <div className="code-func">
          <select onChange={onChangeLanguage} value={language}>
            {Object.keys(fileExtensionMapping).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <select onChange={onChangeTheme} value={theme}>
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="code-screen">
        <Editor
          width={isFullScreen ? "100vw" : "67vw"}
          height={"100%"}
          language={language}
          options={editorOptions}
          theme={theme}
          beforeMount={handleEditorWillMount}
          onChange={handleEditorChange}
          value={code}
        />
      </div>

      <div className="code-functions">
        <div className="screening" onClick={toggleFullScreen}>
          <button>{isFullScreen ? "🔳  Minimize" : "🔲 Full Screen"}</button>
        </div>

        <label htmlFor="input" className="file-functions">
          <span className="material-symbols-outlined">download</span>
          <span>Import Code</span>
        </label>
        <input
          type="file"
          id="input"
          style={{ display: "none" }}
          onChange={onImportCode}
        />

        <button onClick={onExportCode}>
          <span className="material-symbols-outlined">upload</span>
          Export Code
        </button>

        <button id="run-code-btn" onClick={onRunCode}>
          ▶️ Run Code
        </button>
      </div>
    </div>
  );
};
