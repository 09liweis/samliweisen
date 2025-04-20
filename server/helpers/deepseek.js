const { sendRequest } = require("./request");

exports.getRequestFromDS = async () => {
  const userInput = "I will go to supermarket today";

  const AI_API_KEY = process.env.GEMINI_API_KEY;
  const AI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AI_API_KEY}`;

  const prompt = {
    contents: [
      {
        parts: [
          {
            text: `Strictly convert this to JSON: {
          "name": "extracted task name",
          "date": "ISO-8601 date or null",
          "status": "pending"
        }. Input: ${userInput}`,
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
    },
  };

  const response = await sendRequest({
    url: AI_API_URL,
    method: "POST",
    body: prompt,
  });

  console.log(JSON.stringify(response));

  return response;
};
