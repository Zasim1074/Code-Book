import { useParams } from "react-router-dom";
import "./index.scss";
import { EditorContainer } from "./EditorContainer";
import { useCallback, useState } from "react";
import { makeSubmission } from "./Service";
import { AIModal } from "./AIModal";

export const PlaygroundScreen = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const params = useParams();
  const { fileId, folderId } = params;
  // console.log(params);

  const onChangeCode = (event) => {
    setInput(event.target.value);
  };

  const onImportInput = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedExtensions = ["js", "java", "py", "cpp"];

    const fileExtension = file.name.split(".").pop();

    if (allowedExtensions.includes(fileExtension)) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (event) => {
        const importedCode = event.target.result;
        setInput(importedCode);
        codeRef.current = importedCode;
      };
    } else {
      alert("Please choose a valid code file (.js, .java, .py, .cpp).");
    }
  };

  const onExportOutput = (event) => {
    const outputValue = output.trim();

    if (!outputValue) {
      alert("Plz generate some output.");
    } else {
      const blob = new Blob([outputValue], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `output.text`;
      link.click();
    }
  };

  const callback = ({ apiStatus, data, message }) => {
    if (apiStatus === "loading") {
      setShowLoader(true);
      setOutput("");
    } else if (apiStatus === "error") {
      setOutput(`Error: ${message || "Unknown error occurred"}`);
      setShowLoader(false);
    } else {
      const decodedOutput = data.stdout
        ? atob(data.stdout)
        : data.stderr
        ? atob(data.stderr)
        : "No output";

      setOutput(decodedOutput);
      setShowLoader(false);
    }
  };

  const runCode = useCallback(
    ({ code, language }) => {
      makeSubmission({ code, language, stdin: input, callback });
    },
    [input]
  );

  return (
    <div className="playground-container">
      <div className="code-container">
        <EditorContainer
          fileId={fileId}
          folderId={folderId}
          runCode={runCode}
        />

        <div className="input-output-container">
          <div className="input-container">
            <div className="boxs">
              <p>Input:</p>
              <label htmlFor="inputCode" className="file-functions">
                <span className="material-symbols-outlined">download</span>
                <span id="imp-int">Import Input</span>
              </label>
              <input
                type="file"
                id="inputCode"
                style={{ display: "none" }}
                onChange={onImportInput}
              />
            </div>
            <textarea value={input} onChange={onChangeCode} />
          </div>

          <div className="output-container">
            <div className="boxs">
              <p>Output:</p>
              <button onClick={onExportOutput}>
                <span className="material-symbols-outlined">upload</span>
                <span>Export Output</span>
              </button>
            </div>

            <textarea readOnly value={output}></textarea>
          </div>

          <AIModal />
        </div>
      </div>

      {showLoader && (
        <div className="full-loader">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
