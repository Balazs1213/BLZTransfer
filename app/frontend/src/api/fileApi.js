const CHECK_STATUS_URL =
  "https://qigh5mj3inljeykao7ruvjopyu0eyfiv.lambda-url.us-east-1.on.aws/";

export const checkFileStatus = async (fileName, userId = "guest") => {
  try {
    const response = await fetch(CHECK_STATUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ FileName: fileName, UserId: userId }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error("Error fetching status:", error);
    return "Error";
  }
};
