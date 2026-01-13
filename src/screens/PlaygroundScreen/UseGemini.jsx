import { useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyAcaxmmGgah7-5hySlhyjocbeN14xvs6tU";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`

const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchGeminiResponse = async (query) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: query }] }],
        }
      );
      setResponse(res.data.candidates[0]?.content?.parts[0]?.text || "No response.");
    } catch (err) {
      setError("Gemini Data .");
    }
    setLoading(false);
  };
  return { fetchGeminiResponse, response, loading, error };
};

export default useGemini;
