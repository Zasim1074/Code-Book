import React, { createContext, useState } from "react";
import useGemini from "./UseGemini";
import "./AIModal.scss";

export const AIContext = createContext();

export const AIModal = () => {
  const [query, setQuery] = useState("");
  const { fetchGeminiResponse, response, loading, error } = useGemini();

  const handleSend = () => {
    if (query.trim()) {
      fetchGeminiResponse(query);
      setQuery("");
    }
  };

  return (
    <div className="ai-modal">
      <div className="header">
        <h2>
          <span className="material-symbols-outlined">robot_2</span>Ask AI
        </h2>
      </div>

      <div className="chat-box">
        {loading ? (
          <p>Loading...</p>
        ) : (
          response && (
            <textarea
              readOnly
              placeholder="Get your output here..."
              value={response}
            />
          )
        )}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="footer">
        <textarea
          id="give-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..."
          rows="auto"
        />
        <button id="send-key" type="submit" onClick={handleSend}>
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
};
