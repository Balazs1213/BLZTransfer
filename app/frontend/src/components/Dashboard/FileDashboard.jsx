import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { BsTrashFill } from "react-icons/bs";
import { QRCodeSVG } from "qrcode.react";
import { deleteFile, getDownloadUrl, getUserFiles } from "../../api/fileApi";
import styles from "./FileDashboard.module.css";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const toNumberOrNull = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getFileExtension = (file) => {
  const sourceName = String(file?.fileName || file?.originalName || "");
  const dotIndex = sourceName.lastIndexOf(".");
  if (dotIndex <= -1 || dotIndex === sourceName.length - 1) {
    return "";
  }

  return sourceName.slice(dotIndex + 1).toLowerCase();
};

const getUploadTimestamp = (file) => {
  const date = new Date(file?.uploadDate || "");
  const timestamp = date.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getIsInactive = (file) => {
  const normalizedStatus = String(file?.status || "")
    .trim()
    .toLowerCase();
  const revokedFlag =
    file?.isRevoked === true ||
    file?.revoked === true ||
    normalizedStatus === "revoked" ||
    normalizedStatus === "inactive" ||
    normalizedStatus === "not active" ||
    normalizedStatus === "notactive";

  const numericLimits = [
    file?.remainingDownloads,
    file?.downloadsLeft,
    file?.downloadLimit,
    file?.maxDownloads,
    file?.maxAllowedDownloads,
  ]
    .map(toNumberOrNull)
    .filter((value) => value !== null);

  const hasExhaustedLimit = numericLimits.some((value) => value <= 0);
  return revokedFlag || hasExhaustedLimit;
};

const normalizeFile = (file) => {
  const safeFile = file && typeof file === "object" ? file : {};

  return {
    fileName: safeFile.fileName ?? safeFile.FileName ?? "",
    originalName:
      safeFile.originalName ?? safeFile.OriginalName ?? "Untitled file",
    fileSize: safeFile.fileSize ?? safeFile.FileSize ?? 0,
    uploadDate: safeFile.uploadDate ?? safeFile.UploadDate ?? "",
    status: safeFile.status ?? safeFile.Status ?? "Unknown",
    category: safeFile.category ?? safeFile.Category ?? "Uncategorized",
    aiLabels: toArray(safeFile.aiLabels ?? safeFile.AiLabels),
    tags: toArray(safeFile.tags ?? safeFile.Tags),
    extractedText: safeFile.extractedText ?? safeFile.ExtractedText ?? "",
    maxDownloads: safeFile.maxDownloads ?? safeFile.MaxDownloads ?? null,
    remainingDownloads:
      safeFile.remainingDownloads ?? safeFile.RemainingDownloads ?? null,
    downloadsLeft: safeFile.downloadsLeft ?? safeFile.DownloadsLeft ?? null,
    downloadLimit: safeFile.downloadLimit ?? safeFile.DownloadLimit ?? null,
    maxAllowedDownloads:
      safeFile.maxAllowedDownloads ?? safeFile.MaxAllowedDownloads ?? null,
    revoked: safeFile.revoked ?? safeFile.Revoked ?? false,
    isRevoked: safeFile.isRevoked ?? safeFile.IsRevoked ?? false,
  };
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const extractPreview = (text) => {
  if (!text || typeof text !== "string") return "";

  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed.length > 100 ? `${trimmed.slice(0, 100)}...` : trimmed;
};

const getFileId = (file, fallbackIndex = 0) => {
  return file?.fileName || file?.originalName || `file-${fallbackIndex}`;
};

const formatRemaining = (remainingMs) => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const GUEST_FILE_STORAGE_KEY = "blz_guest_file";

const FileDashboard = ({
  userId = "guest",
  apiUrl,
  t = (key) => key,
  onFilesChange,
  refreshTrigger = 0,
}) => {
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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [extFilter, setExtFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

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
    return translated !== normalized ? translated : value || t("n/a");
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
    return Array.from(
      new Set(files.map((file) => getFileExtension(file)).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [files]);

  const filteredAndSortedFiles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = files.filter((file) => {
      const fileName = String(file?.fileName || "").toLowerCase();
      const originalName = String(file?.originalName || "").toLowerCase();
      const tags = [...toArray(file?.tags), ...toArray(file?.aiLabels)]
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.toLowerCase());

      const searchMatches =
        !normalizedSearch ||
        fileName.includes(normalizedSearch) ||
        originalName.includes(normalizedSearch) ||
        tags.some((tag) => tag.includes(normalizedSearch));

      const inactive = getIsInactive(file);
      const statusMatches =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && !inactive) ||
        (statusFilter === "INACTIVE" && inactive);

      const categoryMatches =
        categoryFilter === "ALL" || file?.category === categoryFilter;

      const extensionMatches =
        extFilter === "ALL" || getFileExtension(file) === extFilter;

      return (
        searchMatches && statusMatches && categoryMatches && extensionMatches
      );
    });

    return filtered.sort((firstFile, secondFile) => {
      const firstTimestamp = getUploadTimestamp(firstFile);
      const secondTimestamp = getUploadTimestamp(secondFile);

      if (sortOrder === "OLDEST") {
        return firstTimestamp - secondTimestamp;
      }

      return secondTimestamp - firstTimestamp;
    });
  }, [files, searchTerm, statusFilter, categoryFilter, extFilter, sortOrder]);

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

  if (!hasFiles) {
    return !isGuestUser ? (
      <section className={styles.state}>{t("noFilesFound")}</section>
    ) : null;
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
        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            marginBottom: "0.5rem",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder")}
            style={{
              gridColumn: "1 / -1",
              width: "100%",
              padding: "0.65rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="ACTIVE">{t("active")}</option>
            <option value="INACTIVE">{t("inactive")}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="ALL">{t("allCategories")}</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={extFilter}
            onChange={(e) => setExtFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="ALL">{t("allExtensions")}</option>
            {availableExtensions.map((extension) => (
              <option key={extension} value={extension}>
                .{extension}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="NEWEST">{t("sortNewest")}</option>
            <option value="OLDEST">{t("sortOldest")}</option>
          </select>
        </div>

        {filteredAndSortedFiles.map((file, index) => {
          const labels = toArray(file.aiLabels).filter(
            (label) => typeof label === "string" && label.trim(),
          );
          const textPreview = extractPreview(file.extractedText);
          const cardKey = `${getFileId(file, index)}-${index}`;
          const derivedState = getDerivedLinkState(file, index);
          const isActive = derivedState.status === "active";
          const isExpired = derivedState.status === "expired";

          const cardClasses = [styles.card];
          if (isActive) cardClasses.push(styles.cardActive);
          if (isExpired) cardClasses.push(styles.cardExpired);

          return (
            <article
              key={cardKey}
              className={cardClasses.join(" ")}
              onClick={() => setSelectedFile(file)}
            >
              <h3 className={styles.fileName}>{file.originalName}</h3>

              <div className={styles.statusBadge}>
                {derivedState.status === "inactive" && (
                  <>
                    <FiClock className={styles.statusIconMuted} />
                    <span>{t("notActive")}</span>
                  </>
                )}

                {isActive && (
                  <>
                    <FiCheckCircle className={styles.statusIconActive} />
                    <span>
                      {renderActiveStateLabel(
                        "active",
                        derivedState.type,
                        derivedState.remainingSeconds,
                      )}
                    </span>
                  </>
                )}

                {isExpired && (
                  <>
                    <FiXCircle className={styles.statusIconExpired} />
                    <span>{t("notActive")}</span>
                  </>
                )}
              </div>

              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>{t("uploadedLabel")}</span>{" "}
                {formatDate(file.uploadDate)}
              </p>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>{t("statusLabel")}</span>{" "}
                {translateStatusValue(file.status)}
              </p>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>{t("categoryLabel")}</span>{" "}
                {file.category || t("n/a")}
              </p>

              {labels.length > 0 && (
                <div className={styles.labelsWrap}>
                  {labels.map((label, labelIndex) => (
                    <span
                      key={`${label}-${labelIndex}`}
                      className={styles.badge}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {textPreview && (
                <blockquote className={styles.quote}>{textPreview}</blockquote>
              )}

              <div className={styles.cardActions}>
                {isActive && !isGuestUser && (
                  <button
                    type="button"
                    className={styles.revokeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevoke(derivedState.fileId);
                    }}
                  >
                    {t("revoke")}
                  </button>
                )}

                {!(
                  userId === "guest" &&
                  (file.status?.toLowerCase() === "revoked" ||
                    file.status?.toLowerCase() === "not active" ||
                    file.status?.toLowerCase() === "notactive")
                ) &&
                  isExpired && (
                    <button
                      type="button"
                      className={styles.regenerateBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                      }}
                    >
                      {t("getLink")}
                    </button>
                  )}

                <button
                  type="button"
                  className={styles.trashBtn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ffe5e5",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileToDelete(file);
                  }}
                  aria-label={t("delete")}
                >
                  <BsTrashFill
                    style={{
                      color: "#d9534f",
                      fontSize: "20px",
                      minWidth: "20px",
                      minHeight: "20px",
                      display: "block",
                    }}
                  />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {selectedFile && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedFile(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>{selectedFile.originalName}</h3>

            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("statusLabel")}</span>{" "}
              {translateStatusValue(selectedFile.status)}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("categoryLabel")}</span>{" "}
              {selectedFile.category || t("n/a")}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("uploadedLabel")}</span>{" "}
              {formatDate(selectedFile.uploadDate)}
            </p>

            <div className={styles.durationControl}>
              <label htmlFor="durationSelect" className={styles.durationLabel}>
                {t("validForMinutes")}
              </label>
              <select
                id="durationSelect"
                className={styles.durationSelect}
                value={isGuestUser ? 60 : selectedDuration}
                disabled={isGuestUser}
                onChange={(e) =>
                  setSelectedDuration(Number(e.target.value) || 1)
                }
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={15}>15</option>
                <option value={60}>60</option>
              </select>

              {isGuestUser && (
                <p className={styles.metaRow}>{t("guestExpiryNote")}</p>
              )}

              <label
                htmlFor="maxDownloadsInput"
                className={styles.durationLabel}
              >
                {t("maxDownloads")}
              </label>
              <input
                id="maxDownloadsInput"
                type="number"
                min={1}
                step={1}
                className={styles.durationSelect}
                value={isGuestUser ? 1 : maxDownloads}
                disabled={isGuestUser}
                onChange={(e) =>
                  setMaxDownloads(Math.max(1, Number(e.target.value) || 1))
                }
              />

              {isGuestUser && (
                <p className={styles.metaRow}>{t("guestDownloadNote")}</p>
              )}
            </div>

            {modalError && <p className={styles.modalError}>{modalError}</p>}

            {activeSelectedState?.status === "active" &&
            activeSelectedState.url ? (
              <div className={styles.generatedWrap}>
                <p className={styles.generatedMeta}>
                  {t("active")} (
                  {activeSelectedState.type === "qr" ? "QR" : "Link"}) -{" "}
                  {formatRemaining(activeSelectedState.remainingSeconds * 1000)}
                </p>

                {activeSelectedState.type === "qr" ? (
                  <div className={styles.qrWrap}>
                    <QRCodeSVG value={activeSelectedState.url} size={180} />
                  </div>
                ) : null}

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(activeSelectedState.url)}
                  >
                    {t("copyLink")}
                  </button>
                  <button
                    type="button"
                    className={styles.revokeBtn}
                    onClick={() => handleRevoke(activeSelectedState.fileId)}
                  >
                    {t("revoke")}
                  </button>
                </div>

                {copyFeedback && (
                  <p className={styles.copiedText}>{copyFeedback}</p>
                )}
              </div>
            ) : (
              <div className={styles.modalActions}>
                {!(
                  userId === "guest" &&
                  (selectedFile?.status?.toLowerCase() === "revoked" ||
                    selectedFile?.status?.toLowerCase() === "not active" ||
                    selectedFile?.status?.toLowerCase() === "notactive")
                ) && (
                  <>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() =>
                        handleGenerate(
                          selectedFile,
                          "link",
                          isGuestUser ? 60 : selectedDuration,
                          isGuestUser ? 1 : maxDownloads,
                        )
                      }
                      disabled={isGenerating}
                    >
                      {isGenerating ? t("generating") : t("getLink")}
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() =>
                        handleGenerate(
                          selectedFile,
                          "qr",
                          isGuestUser ? 60 : selectedDuration,
                          isGuestUser ? 1 : maxDownloads,
                        )
                      }
                      disabled={isGenerating}
                    >
                      {isGenerating ? t("generating") : t("getQrCode")}
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => {
                setModalError("");
                setSelectedFile(null);
              }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {fileToDelete && (
        <div
          className={styles.modalOverlay}
          onClick={() => setFileToDelete(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>{t("confirmDeleteTitle")}</h3>

            <p className={styles.metaRow}>{t("confirmDeleteText")}</p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>
                {fileToDelete.originalName}
              </span>
            </p>

            {modalError && <p className={styles.modalError}>{modalError}</p>}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => setFileToDelete(null)}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={confirmAndDelete}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReplaceModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowReplaceModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>{t("replaceWarningTitle")}</h3>
            <p className={styles.metaRow}>{t("replaceWarningText")}</p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => setShowReplaceModal(false)}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={confirmReplaceFile}
              >
                {t("replaceFileBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDashboard;
