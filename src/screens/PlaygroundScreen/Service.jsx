const languageCodemap = {
  cpp: 54,
  python: 71,
  java: 62,
  javascript: 63,
};

async function getSubmission(tokenId) {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c1b2add7b1msha475ba7f35d6d34p1342edjsn1ca5c99266f4",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    let response, result;
    let attempts = 0;

    while (attempts < 10) {
      response = await fetch(url, options);
      result = await response.json();

      if (result.status?.id <= 2) {
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        break; 
      }

      attempts++;
    }

    return result;
  } catch (error) {
    console.error("Error fetching submission result:", error);
    return { error: error.message };
  }
}

export async function makeSubmission({ code, language, stdin, callback }) {
  const url = `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*`;
  const httpOptions = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "c1b2add7b1msha475ba7f35d6d34p1342edjsn1ca5c99266f4",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: languageCodemap[language],
      source_code: btoa(code), 
      stdin: btoa(stdin), 
    }),
  };

  try {
    callback({ apiStatus: "loading" });

    const response = await fetch(url, httpOptions);
    const result = await response.json();
    const tokenId = result.token;

    if (!tokenId) {
      throw new Error(
        `Submission token not received. API Response: ${JSON.stringify(result)}`
      );
    }

    const apiSubmissionResult = await getSubmission(tokenId);

    if (!apiSubmissionResult || apiSubmissionResult.error) {
      callback({
        apiStatus: "error",
        message: `Failed to fetch execution results from Judge0: ${
          apiSubmissionResult.error || "Unknown error"
        }`,
      });
      return;
    }

    const statusCode = apiSubmissionResult.status.id;

    if (statusCode === 6) {
      callback({
        apiStatus: "error",
        message: "Compilation Error",
        data: apiSubmissionResult,
      });
      return;
    } else if (statusCode === 11) {
      callback({
        apiStatus: "error",
        message: "Runtime Error",
        data: apiSubmissionResult,
      });
      return;
    }

    const decodedOutput = apiSubmissionResult.stdout
      ? window.atob(apiSubmissionResult.stdout) 
      : apiSubmissionResult.stderr
      ? window.atob(apiSubmissionResult.stderr) 
      : "No output";

    callback({
      apiStatus: "success",
      data: { ...apiSubmissionResult, decodedOutput },
    });
  } catch (error) {
    callback({ apiStatus: "error", message: error.message });
  }
}
