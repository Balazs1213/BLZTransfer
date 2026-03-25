import "./App.css";
import AuthHome from "./components/Auth/AuthHome/AuthHome";
import FilePicker from "./components/Upload/FilePicker/FilePicker";
import Button from "./components/UI/Buttons/Button";
import { useState } from "react";

// Itt importáljuk az előbb létrehozott API hívásunkat!
import { checkFileStatus } from "./api/fileApi";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userType, setUserType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- ÚJ STATE-EK A PROGRESS BAR-HOZ ---
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Idle"); // "Idle", "Uploading", "Scanning", "Clean", "Infected", "Error"

  const loginHandler = () => {
    setUserType("user");
    setIsAuthorized(true);
  };

  const guestHandler = () => {
    setUserType("guest");
    setIsAuthorized(true);
  };

  const fileSelectHandler = (file) => {
    setSelectedFile(file);
    console.log("File selected in App:", file.name);
    // Visszaállítjuk a csíkot, ha új fájlt választ
    setProgress(0);
    setStatusText("");
    setCurrentStatus("Idle");
  };

  const uploadHandler = async (file) => {
    console.log("Starting upload process for:", file.name);

    setIsUploading(true);
    setProgress(10);
    setCurrentStatus("Uploading");
    setStatusText("Preparing upload...");

    const API_ENDPOINT =
      "https://h4g8mvrgwd.execute-api.us-east-1.amazonaws.com/dev/get-upload-link";

    try {
      console.log("1. Requesting Pre-signed URL from API...");
      const apiResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, fileSize: file.size }),
        headers: { "Content-Type": "application/json" },
      });

      if (!apiResponse.ok) throw new Error("Failed to get URL from API.");

      const apiData = await apiResponse.json();
      const uploadUrl = apiData.uploadUrl || apiData.UploadUrl;
      const generatedFileName = apiData.fileName || apiData.FileName;

      setProgress(30);
      setStatusText("Uploading to AWS S3...");

      console.log("3. Starting direct S3 upload...");
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

      while (pollingStatus === "Scanning" || pollingStatus === "NotFound") {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        pollingStatus = await checkFileStatus(generatedFileName, userType);

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

          {/* Átadjuk az új propokat a FilePicker-nek */}
          <FilePicker
            onFileSelect={fileSelectHandler}
            isUploading={isUploading}
            progress={progress}
            statusText={statusText}
            currentStatus={currentStatus}
          />

          {/* Gomb megjelenítése, de elrejtjük / letiltjuk ha épp feltölt! */}
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
        </div>
      )}
    </main>
  );
}

export default App;
