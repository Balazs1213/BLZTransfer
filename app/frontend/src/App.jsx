import "./App.css";
import { useEffect, useState } from "react";
import AuthHome from "./components/Auth/AuthHome/AuthHome";
import FilePicker from "./components/Upload/FilePicker/FilePicker";
import Button from "./components/UI/Buttons/Button";
import FileDashboard from "./components/Dashboard/FileDashboard";
import { checkFileStatus } from "./api/fileApi";
import { IoSettingsOutline } from "react-icons/io5";
import SettingsModal from "./components/Settings/SettingsModal";
import { translations } from "./utils/translations";

const USER_FILES_API_URL =
  "https://s2t1s0rl7g.execute-api.us-east-1.amazonaws.com/default/blz-get-user-files";
const GUEST_FILE_STORAGE_KEY = "blz_guest_file";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("appLang") || "en",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("guest");
  const [activeTab, setActiveTab] = useState("upload");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Idle");
  const [guestFileCount, setGuestFileCount] = useState(0);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem("appLang", language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || key;

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
    setIsSettingsOpen(false);
    setUserType(null);
    setCurrentUsername("guest");
    setActiveTab("upload");
    setSelectedFile(null);
    setProgress(0);
    setStatusText("");
    setCurrentStatus("Idle");
    setGuestFileCount(0);
    setDashboardRefreshTrigger(0);
    localStorage.removeItem(GUEST_FILE_STORAGE_KEY);
  };

  const handleDashboardRefresh = () => {
    setDashboardRefreshTrigger((current) => current + 1);
  };

  const fileSelectHandler = (file) => {
    const MAX_GUEST_SIZE = 50 * 1024 * 1024;

    if (userType === "guest" && file.size > MAX_GUEST_SIZE) {
      alert(t("error_guest_file_too_large"));
      return;
    }

    setSelectedFile(file);
    setProgress(0);
    setStatusText("");
    setCurrentStatus("Idle");
  };

  const uploadHandler = async (file) => {
    setIsUploading(true);
    setProgress(10);
    setCurrentStatus("Uploading");
    setStatusText(t("msg_uploading"));

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
      setStatusText(t("msg_uploading"));

      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      if (!s3Response.ok) throw new Error("S3 upload failed.");

      setProgress(50);
      setStatusText(t("msg_processing"));
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
          setStatusText(t("msg_processing"));
        }
      }

      setCurrentStatus(pollingStatus);
      setProgress(100);

      if (pollingStatus === "Clean") {
        setStatusText(t("msg_successClean"));
        if (isGuest) {
          localStorage.setItem(GUEST_FILE_STORAGE_KEY, generatedFileName);
          handleDashboardRefresh();
        }
        setSelectedFile(null);
      } else if (pollingStatus === "Infected") {
        setStatusText(t("msg_infected"));
      } else {
        setStatusText(t("msg_error"));
        setCurrentStatus("Error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatusText(t("msg_error"));
      setCurrentStatus("Error");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const isGuest = userType === "guest";

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-title">
            {!isAuthorized
              ? "BLZ Transfer"
              : isGuest
                ? t("guestTransfer")
                : t("secureDashboard")}
          </h1>
        </div>

        <div className="navbar-content">
          {/* TABS - Only show both tabs if user is logged in */}
          {isAuthorized && !isGuest && (
            <div className="navbar-tabs">
              <button
                className={`navbar-tab ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                {t("upload")}
              </button>
              <button
                className={`navbar-tab ${activeTab === "myfiles" ? "active" : ""}`}
                onClick={() => setActiveTab("myfiles")}
              >
                {t("myFiles")}
              </button>
            </div>
          )}

          {/* USER INFO, LOGOUT, SETTINGS */}
          <div className="navbar-user">
            {isAuthorized && (
              <>
                <span className="navbar-username">
                  {t("welcome")}, <strong>{currentUsername}</strong>
                </span>
                <Button onClick={logoutHandler} className="logout-btn">
                  {isGuest ? t("back") : t("logout")}
                </Button>
              </>
            )}

            <button
              type="button"
              className="settings-trigger"
              aria-label="Open settings"
              onClick={() => setIsSettingsOpen(true)}
            >
              <IoSettingsOutline className="settings-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      {!isAuthorized ? (
        <main className="auth-main">
          <AuthHome
            onLogin={loginHandler}
            onContinueAsGuest={guestHandler}
            language={language}
            t={t}
          />
        </main>
      ) : (
        <main className="dashboard-main">
          {/* UPLOAD TAB */}
          {(isGuest || activeTab === "upload") && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>{t("upload")}</h2>
              </div>

              <div className="section-content">
                {(!isGuest || guestFileCount < 1) && (
                  <FilePicker
                    onFileSelect={fileSelectHandler}
                    onUploadSuccess={handleDashboardRefresh}
                    isUploading={isUploading}
                    progress={progress}
                    statusText={statusText}
                    currentStatus={currentStatus}
                    t={t}
                  />
                )}

                {selectedFile && !isUploading && progress === 0 && (
                  <div className="file-ready-action">
                    <p className="ready-text">
                      {t("readyToScan")} <strong>{selectedFile.name}</strong>
                    </p>
                    <Button onClick={() => uploadHandler(selectedFile)}>
                      {t("startUpload")}
                    </Button>
                  </div>
                )}

                {isGuest && (
                  <FileDashboard
                    userId={currentUsername}
                    apiUrl={USER_FILES_API_URL}
                    t={t}
                    onFilesChange={setGuestFileCount}
                    refreshTrigger={dashboardRefreshTrigger}
                  />
                )}
              </div>
            </section>
          )}

          {/* MY FILES TAB - Only for logged-in users */}
          {!isGuest && activeTab === "myfiles" && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>{t("myFiles")}</h2>
              </div>

              <div className="section-content">
                <FileDashboard
                  userId={currentUsername}
                  apiUrl={USER_FILES_API_URL}
                  t={t}
                />
              </div>
            </section>
          )}
        </main>
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
      )}
    </div>
  );
}

export default App;
