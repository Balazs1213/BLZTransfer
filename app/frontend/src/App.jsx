import "./App.css";
import { useState } from "react";
import AuthHome from "./components/Auth/AuthHome/AuthHome";
import FilePicker from "./components/Upload/FilePicker/FilePicker";
import Button from "./components/UI/Buttons/Button";
import FileDashboard from "./components/Dashboard/FileDashboard";
import { checkFileStatus } from "./api/fileApi";

// ============================================
// I18N: Multi-language support preparation
// ============================================
const T = {
  en: {
    guestFileTransfer: "Guest File Transfer",
    secureUserDashboard: "Secure User Dashboard",
    uploadTab: "Upload",
    myFilesTab: "My Files",
    welcome: "Welcome",
    logout: "Logout",
    backToHome: "Back to Home",
    startUpload: "Start Upload & Scan",
    readyToScan: "Ready to scan:",
    myUploadedFiles: "My Uploaded Files",
    uploadingToS3: "Uploading to AWS S3...",
    virusScanInProgress: "Virus scan in progress... 🛡️",
    uploadSuccessful: "Upload successful! File is clean. ✅",
    uploadAborted: "Upload aborted! Virus detected! ❌☣️",
    scanError: "An error occurred during scanning.",
    preparingUpload: "Preparing upload...",
  },
};

const getTranslation = (key, language = "en") => {
  return T[language]?.[key] || T.en[key] || key;
};

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userType, setUserType] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("guest");
  const [activeTab, setActiveTab] = useState("upload");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Idle");

  const loginHandler = (username) => {
    setUserType("user");
    setCurrentUsername(username);
    setActiveTab("myfiles");
    setIsAuthorized(true);
  };

  const guestHandler = () => {
    setUserType("guest");
    setCurrentUsername("guest");
    setActiveTab("upload");
    setIsAuthorized(true);
  };

  const logoutHandler = () => {
    setIsAuthorized(false);
    setUserType(null);
    setCurrentUsername("guest");
    setActiveTab("upload");
    setSelectedFile(null);
    setProgress(0);
    setStatusText("");
    setCurrentStatus("Idle");
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
    setStatusText(getTranslation("preparingUpload"));

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
      setStatusText(getTranslation("uploadingToS3"));

      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      if (!s3Response.ok) throw new Error("S3 upload failed.");

      setProgress(50);
      setStatusText(getTranslation("virusScanInProgress"));
      setCurrentStatus("Scanning");

      let pollingStatus = "Scanning";
      let fakeProgress = 50;

      while (pollingStatus === "Scanning" || pollingStatus === "NotFound") {
        await new Promise((resolve) => setTimeout(resolve, 2000));

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
        setStatusText(getTranslation("uploadSuccessful"));
        setSelectedFile(null);
      } else if (pollingStatus === "Infected") {
        setStatusText(getTranslation("uploadAborted"));
      } else {
        setStatusText(getTranslation("scanError"));
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

  if (!isAuthorized) {
    return <AuthHome onLogin={loginHandler} onContinueAsGuest={guestHandler} />;
  }

  const isGuest = userType === "guest";

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-title">
            {isGuest
              ? getTranslation("guestFileTransfer")
              : getTranslation("secureUserDashboard")}
          </h1>
        </div>

        <div className="navbar-content">
          {/* TABS - Only show both tabs if user is logged in */}
          {!isGuest && (
            <div className="navbar-tabs">
              <button
                className={`navbar-tab ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                {getTranslation("uploadTab")}
              </button>
              <button
                className={`navbar-tab ${activeTab === "myfiles" ? "active" : ""}`}
                onClick={() => setActiveTab("myfiles")}
              >
                {getTranslation("myFilesTab")}
              </button>
            </div>
          )}

          {/* USER INFO & LOGOUT */}
          <div className="navbar-user">
            <span className="navbar-username">
              {getTranslation("welcome")}, <strong>{currentUsername}</strong>
            </span>
            <Button onClick={logoutHandler} className="logout-btn">
              {isGuest
                ? getTranslation("backToHome")
                : getTranslation("logout")}
            </Button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* UPLOAD TAB */}
        {(isGuest || activeTab === "upload") && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>{getTranslation("uploadTab")}</h2>
            </div>

            <div className="section-content">
              <FilePicker
                onFileSelect={fileSelectHandler}
                isUploading={isUploading}
                progress={progress}
                statusText={statusText}
                currentStatus={currentStatus}
              />

              {selectedFile && !isUploading && progress === 0 && (
                <div className="file-ready-action">
                  <p className="ready-text">
                    {getTranslation("readyToScan")}{" "}
                    <strong>{selectedFile.name}</strong>
                  </p>
                  <Button onClick={() => uploadHandler(selectedFile)}>
                    {getTranslation("startUpload")}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* MY FILES TAB - Only for logged-in users */}
        {!isGuest && activeTab === "myfiles" && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>{getTranslation("myUploadedFiles")}</h2>
            </div>

            <div className="section-content">
              <FileDashboard
                userId={currentUsername}
                apiUrl="https://s2t1s0rl7g.execute-api.us-east-1.amazonaws.com/default/blz-get-user-files"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
