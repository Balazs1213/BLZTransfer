import "./App.css";
import AuthHome from "./components/Auth/AuthHome/AuthHome";
import FilePicker from "./components/Upload/FilePicker/FilePicker";
import Button from "./components/UI/Buttons/Button";
import { useState } from "react";
import { checkFileStatus } from "./api/fileApi";
import FileDashboard from "./components/Dashboard/FileDashboard";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userType, setUserType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Itt tároljuk a bejelentkezett felhasználó nevét!
  const [currentUsername, setCurrentUsername] = useState("guest");

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Idle");

  const loginHandler = (username) => {
    setUserType("user");
    setCurrentUsername(username); // Eltesszük a nevet a memóriába
    setIsAuthorized(true);
  };

  const guestHandler = () => {
    setUserType("guest");
    setCurrentUsername("guest");
    setIsAuthorized(true);
  };

  const fileSelectHandler = (file) => {
    setSelectedFile(file);
    setProgress(0);
    setStatusText("");
    setCurrentStatus("Idle");
  };

  const uploadHandler = async (file) => {
    setIsUploading(true);
    setProgress(10);
    setCurrentStatus("Uploading");
    setStatusText("Preparing upload...");

    const API_ENDPOINT =
      "https://h4g8mvrgwd.execute-api.us-east-1.amazonaws.com/dev/get-upload-link";

    try {
      const apiResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          UserId: currentUsername,
          userId: currentUsername,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!apiResponse.ok) throw new Error("Failed to get URL from API.");

      const apiData = await apiResponse.json();
      const uploadUrl = apiData.uploadUrl || apiData.UploadUrl;
      const generatedFileName = apiData.fileName || apiData.FileName;

      setProgress(30);
      setStatusText("Uploading to AWS S3...");

      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      if (!s3Response.ok) throw new Error("S3 upload failed.");

      setProgress(50);
      setStatusText("Virus scan in progress... 🛡️");
      setCurrentStatus("Scanning");

      let pollingStatus = "Scanning";
      let fakeProgress = 50;

      // =====================================
      // POLLING: A vírusvizsgálat lekérdezése
      // =====================================
      while (pollingStatus === "Scanning" || pollingStatus === "NotFound") {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Itt most már garantáltan a helyes névvel (currentUsername) kérdezünk rá!
        pollingStatus = await checkFileStatus(
          generatedFileName,
          currentUsername,
        );

        if (pollingStatus === "Scanning" && fakeProgress < 90) {
          fakeProgress += 5;
          setProgress(fakeProgress);
        }
      }

      setCurrentStatus(pollingStatus);
      setProgress(100);

      if (pollingStatus === "Clean") {
        setStatusText("Upload successful! File is clean. ✅");
        setSelectedFile(null);
      } else if (pollingStatus === "Infected") {
        setStatusText("Upload aborted! Virus detected! ❌☣️");
      } else {
        setStatusText("An error occurred during scanning.");
        setCurrentStatus("Error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatusText(`Error: ${error.message}`);
      setCurrentStatus("Error");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main>
      {!isAuthorized && (
        <AuthHome onLogin={loginHandler} onContinueAsGuest={guestHandler} />
      )}

      {isAuthorized && (
        <div
          style={{ textAlign: "center", marginTop: "2rem", color: "#111827" }}
        >
          <h2>
            {userType === "guest"
              ? "Guest File Transfer"
              : "Secure User Dashboard"}
          </h2>

          <FilePicker
            onFileSelect={fileSelectHandler}
            isUploading={isUploading}
            progress={progress}
            statusText={statusText}
            currentStatus={currentStatus}
          />

          {selectedFile && !isUploading && progress === 0 && (
            <div style={{ marginTop: "1rem" }}>
              <p
                style={{
                  color: "#059669",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Ready to scan: {selectedFile.name}
              </p>
              <Button onClick={() => uploadHandler(selectedFile)}>
                Start Upload & Scan
              </Button>
            </div>
          )}

          <div
            style={{
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>
              My Uploaded Files
            </h3>
            <FileDashboard
              userId={currentUsername}
              apiUrl="https://s2t1s0rl7g.execute-api.us-east-1.amazonaws.com/default/blz-get-user-files"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
