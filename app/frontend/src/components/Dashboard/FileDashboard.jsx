import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { deleteFile, getDownloadUrl, getUserFiles } from "../../api/fileApi";
import {
  formatDate,
  formatRemaining,
  getFileId,
  getFilteredAndSortedFiles,
  normalizeFile,
} from "../../utils/fileHelpers";
import FileCardGrid from "./FileCardGrid";
import FilterSection from "./FilterSection";
import FileModals from "./FileModals";
import styles from "./FileDashboard.module.css";

const GUEST_FILE_STORAGE_KEY = "blz_guest_file";

const FileDashboard = ({
  userId = "guest",
  apiUrl,
  t = (key) => key,
  onFilesChange,
  refreshTrigger = 0,
}) => {
  // NOSONAR
  const executeDownloadBaseUrl =
    "https://h8sikvnc4a.execute-api.us-east-1.amazonaws.com/default/blz-execute-download";
  const isGuestUser = userId === "guest";

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [maxDownloads, setMaxDownloads] = useState(1);
  const [linkStates, setLinkStates] = useState({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalError, setModalError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStateFilter, setActiveStateFilter] = useState("ALL");
  const [avStatusFilter, setAvStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [extFilter, setExtFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveStateFilter("ALL");
    setAvStatusFilter("ALL");
    setCategoryFilter("ALL");
    setExtFilter("ALL");
    setSortOrder("NEWEST");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUserFiles(apiUrl, userId);
      const normalized = Array.isArray(response)
        ? response.map(normalizeFile)
        : [];

      const visibleFiles = isGuestUser
        ? (() => {
            const guestFileName = localStorage.getItem(GUEST_FILE_STORAGE_KEY);
            if (!guestFileName) return [];
            return normalized.filter((file) => file.fileName === guestFileName);
          })()
        : normalized;

      if (
        isGuestUser &&
        localStorage.getItem(GUEST_FILE_STORAGE_KEY) &&
        visibleFiles.length === 0
      ) {
        localStorage.removeItem(GUEST_FILE_STORAGE_KEY);
      }

      setFiles(visibleFiles);
      onFilesChange?.(visibleFiles.length);
    } catch (err) {
      setError(err?.message || "Failed to load files.");
      setFiles([]);
      onFilesChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, isGuestUser, onFilesChange, userId]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh, refreshTrigger]);

  const handleGenerate = async (file, type, durationMinutes, downloads) => {
    const safeMinutes = isGuestUser
      ? 60
      : Math.max(1, Number(durationMinutes) || 1);
    const safeDownloads = isGuestUser ? 1 : Math.max(1, Number(downloads) || 1);
    const fileId = getFileId(file);
    const expiresAt = Date.now() + safeMinutes * 60000;

    try {
      setIsGenerating(true);
      setModalError("");

      const result = await getDownloadUrl(
        file.fileName,
        userId,
        safeMinutes,
        safeDownloads,
      );

      const generatedUrl = result?.downloadUrl || "";
      const isProxyUrl = generatedUrl.startsWith(executeDownloadBaseUrl);
      const proxyUrl = isProxyUrl
        ? generatedUrl
        : `${executeDownloadBaseUrl}?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(file.fileName)}`;

      setLinkStates((prev) => ({
        ...prev,
        [fileId]: {
          status: "active",
          url: proxyUrl,
          expiresAt,
          type,
        },
      }));
    } catch (err) {
      setModalError(err?.message || "Failed to generate download URL.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = (fileId) => {
    setLinkStates((prev) => {
      const existing = prev[fileId];
      if (!existing) return prev;

      return {
        ...prev,
        [fileId]: {
          ...existing,
          status: "expired",
          url: existing.url || "",
          expiresAt: Date.now(),
        },
      };
    });
  };

  const getDerivedLinkState = (file, index) => {
    const fileId = getFileId(file, index);
    const linkState = linkStates[fileId];

    if (!linkState) {
      return {
        fileId,
        status: "inactive",
        url: "",
        type: null,
        remainingSeconds: 0,
      };
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((linkState.expiresAt - currentTime) / 1000),
    );
    const isActive = linkState.status === "active" && remainingSeconds > 0;

    return {
      fileId,
      status: isActive ? "active" : "expired",
      url: linkState.url || "",
      type: linkState.type,
      remainingSeconds,
    };
  };

  const activeSelectedState = selectedFile
    ? getDerivedLinkState(selectedFile)
    : null;

  const copyToClipboard = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 1500);
    } catch {
      // Intentionally ignored when clipboard API is not available.
    }
  };

  const confirmAndDelete = async () => {
    if (!fileToDelete) return;

    try {
      setModalError("");
      await deleteFile(userId, fileToDelete.fileName);

      if (isGuestUser) {
        localStorage.removeItem(GUEST_FILE_STORAGE_KEY);
      }

      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.fileName !== fileToDelete.fileName),
      );

      setLinkStates((currentStates) => {
        const nextStates = { ...currentStates };
        delete nextStates[fileToDelete.fileName];
        return nextStates;
      });

      setSelectedFile((currentSelected) =>
        currentSelected?.fileName === fileToDelete.fileName
          ? null
          : currentSelected,
      );
      setFileToDelete(null);
      onFilesChange?.((current) =>
        Math.max(0, (typeof current === "number" ? current : files.length) - 1),
      );
    } catch (err) {
      setModalError(err?.message || "Failed to delete file.");
    }
  };

  const confirmReplaceFile = async () => {
    const guestFileName = localStorage.getItem(GUEST_FILE_STORAGE_KEY);
    if (!guestFileName) {
      setShowReplaceModal(false);
      return;
    }

    try {
      await deleteFile("guest", guestFileName);
      localStorage.removeItem(GUEST_FILE_STORAGE_KEY);
      setShowReplaceModal(false);
      setSelectedFile(null);
      await handleRefresh();
    } catch (err) {
      setModalError(err?.message || "Failed to delete file.");
      setShowReplaceModal(false);
    }
  };

  const translateStatusValue = (value) => {
    const normalized = String(value ?? "").toLowerCase();
    const translated = t(normalized);
    if (translated === normalized) {
      return value || t("n/a");
    }

    return translated;
  };

  const translateCategoryValue = (value) => {
    const rawCategory = String(value ?? "").trim() || "N/A";
    const key = `cat_${rawCategory}`;
    const translated = t(key);
    if (translated === key) {
      return rawCategory;
    }

    return translated;
  };

  const renderActiveStateLabel = (status, type, remainingSeconds) => {
    const typeLabel = type === "qr" ? "QR" : "Link";
    return `${t(status)} (${typeLabel}) - ${formatRemaining(remainingSeconds * 1000)}`;
  };

  const hasFiles = useMemo(() => files.length > 0, [files]);

  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        files
          .map((file) => String(file?.category || "").trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [files]);

  const availableExtensions = useMemo(() => {
    const filesForExt =
      categoryFilter === "ALL"
        ? files
        : files.filter((file) => file.category === categoryFilter);

    return Array.from(
      new Set(
        filesForExt
          .map((file) => {
            const sourceName = String(
              file?.fileName || file?.originalName || "",
            );
            const parts = sourceName.split(".");
            return parts.length > 1 ? `.${parts.pop().toLowerCase()}` : "";
          })
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [files, categoryFilter]);

  const uniqueAvStatuses = useMemo(() => {
    return Array.from(
      new Set(
        files.map((file) => String(file?.status || "").trim()).filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [files]);

  const filteredAndSortedFiles = useMemo(
    () =>
      getFilteredAndSortedFiles({
        files,
        searchTerm,
        activeStateFilter,
        avStatusFilter,
        categoryFilter,
        extFilter,
        sortOrder,
      }),
    [
      files,
      searchTerm,
      activeStateFilter,
      avStatusFilter,
      categoryFilter,
      extFilter,
      sortOrder,
    ],
  );

  if (loading) {
    return <section className={styles.state}>{t("loadingFiles")}</section>;
  }

  if (error) {
    return (
      <section className={`${styles.state} ${styles.error}`}>
        {t("error")} {error}
      </section>
    );
  }

  if (hasFiles) {
    // continue to the dashboard render below
  } else if (isGuestUser) {
    return null;
  } else {
    return <section className={styles.state}>{t("noFilesFound")}</section>;
  }

  return (
    <>
      {isGuestUser && files.length === 1 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <button
            type="button"
            className={styles.regenerateBtn}
            onClick={() => setShowReplaceModal(true)}
          >
            {t("replaceFileBtn")}
          </button>
        </div>
      )}

      <section className={styles.dashboard}>
        <FilterSection
          t={t}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStateFilter={activeStateFilter}
          setActiveStateFilter={setActiveStateFilter}
          avStatusFilter={avStatusFilter}
          setAvStatusFilter={setAvStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          extFilter={extFilter}
          setExtFilter={setExtFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          uniqueAvStatuses={uniqueAvStatuses}
          availableCategories={availableCategories}
          availableExtensions={availableExtensions}
          translateStatusValue={translateStatusValue}
          translateCategoryValue={translateCategoryValue}
          onClearFilters={handleClearFilters}
        />

        <FileCardGrid
          filteredAndSortedFiles={filteredAndSortedFiles}
          setSelectedFile={setSelectedFile}
          setFileToDelete={setFileToDelete}
          isGuestUser={isGuestUser}
          userId={userId}
          t={t}
          styles={styles}
          renderActiveStateLabel={renderActiveStateLabel}
          translateStatusValue={translateStatusValue}
          translateCategoryValue={translateCategoryValue}
          getDerivedLinkState={getDerivedLinkState}
          handleRevoke={handleRevoke}
          formatDate={formatDate}
        />
      </section>

      <FileModals
        selectedFile={selectedFile}
        fileToDelete={fileToDelete}
        showReplaceModal={showReplaceModal}
        setSelectedFile={setSelectedFile}
        setFileToDelete={setFileToDelete}
        setShowReplaceModal={setShowReplaceModal}
        setModalError={setModalError}
        t={t}
        styles={styles}
        isGuestUser={isGuestUser}
        userId={userId}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        maxDownloads={maxDownloads}
        setMaxDownloads={setMaxDownloads}
        modalError={modalError}
        activeSelectedState={activeSelectedState}
        copyFeedback={copyFeedback}
        isGenerating={isGenerating}
        handleGenerate={handleGenerate}
        handleRevoke={handleRevoke}
        copyToClipboard={copyToClipboard}
        translateStatusValue={translateStatusValue}
        translateCategoryValue={translateCategoryValue}
        confirmAndDelete={confirmAndDelete}
        confirmReplaceFile={confirmReplaceFile}
        formatDate={formatDate}
      />

    </>
  );
};

FileDashboard.propTypes = {
  userId: PropTypes.string,
  apiUrl: PropTypes.string,
  t: PropTypes.func,
  onFilesChange: PropTypes.func,
  refreshTrigger: PropTypes.number,
};

export default FileDashboard;
