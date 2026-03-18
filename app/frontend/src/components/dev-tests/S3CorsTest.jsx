import React, { useState } from "react";

function S3CorsTest() {
  const [status, setStatus] = useState("Waiting for test to start...");

  const handleFullUploadTest = async () => {
    const API_URL =
      " https://edjc4tzhwc.execute-api.us-east-1.amazonaws.com/default/blz-get-presigned-url";

    try {
      // --- STEP 1: Request Presigned URL from Lambda via API Gateway ---
      setStatus("1. Requesting Presigned URL from API Gateway...");
      console.log("Calling API:", API_URL);

      const apiResponse = await fetch(`${API_URL}?fileName=final-test.txt`);
      const apiData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error("Lambda failed to generate the presigned URL!");
      }

      const uploadUrl = apiData.uploadUrl;
      setStatus("2. Presigned URL received! Uploading file to S3...");
      console.log("Received S3 Link:", uploadUrl);

      // --- STEP 2: Upload to S3 using the received link ---
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: "Congratulations! This file successfully passed through the entire BLZTransfer system!",
      });

      if (uploadResponse.ok) {
        setStatus("✅ 3. SUCCESS! File is in the Quarantine bucket (200 OK)!");
        console.log("Upload successful: 200 OK");
      } else {
        setStatus(`❌ S3 Error: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error("Error during the process:", error);
      setStatus(`❌ An error occurred: Check the console (F12)`);
    }
  };

  return (
    <div
      style={{
        border: "2px solid #00ff00",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "8px",
        backgroundColor: "#1a1a1a",
      }}
    >
      <h2 style={{ color: "#00ff00" }}>🚀 Full System Integration Test</h2>
      <button
        onClick={handleFullUploadTest}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#00ff00",
          color: "black",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        Upload Test File
      </button>
      <p style={{ marginTop: "15px", color: "#fff" }}>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}

export default S3CorsTest;
