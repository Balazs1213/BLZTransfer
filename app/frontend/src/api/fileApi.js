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

export const getUserFiles = async (apiUrl, userId = "guest") => {
  if (!apiUrl || typeof apiUrl !== "string") {
    throw new Error("Missing or invalid apiUrl");
  }

  const safeUserId =
    userId && String(userId).trim() ? String(userId).trim() : "guest";
  const normalizedUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  const requestUrl = `${normalizedUrl}?userId=${encodeURIComponent(safeUserId)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user files: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};
