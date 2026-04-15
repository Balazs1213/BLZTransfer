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

export const getDownloadUrl = async (
  fileName,
  userId = "guest",
  expiresInMinutes = 5,
  maxDownloads = 1,
) => {
  if (!fileName || typeof fileName !== "string") {
    throw new Error("fileName is required");
  }

  const safeUserId =
    userId && String(userId).trim() ? String(userId).trim() : "guest";
  const safeExpires = Math.max(1, Number(expiresInMinutes) || 5);
  const safeMaxDownloads = Math.max(1, Number(maxDownloads) || 1);
  const downloadGeneratorUrl =
    "https://41tjtywnd9.execute-api.us-east-1.amazonaws.com/default/blz-get-download-url";

  const response = await fetch(downloadGeneratorUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName,
      userId: safeUserId,
      expiresInMinutes: safeExpires,
      maxDownloads: safeMaxDownloads,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message || `Failed to generate URL: ${response.status}`,
    );
  }

  if (!payload?.downloadUrl) {
    throw new Error("downloadUrl is missing in API response");
  }

  return payload;
};

export const deleteFile = async (userId, fileName) => {
  const response = await fetch(
    "https://42yn5wo3a1.execute-api.us-east-1.amazonaws.com/default/blz-delete-file",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, fileName }),
    },
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.message || `Failed to delete file: ${response.status}`,
    );
  }

  return payload;
};
