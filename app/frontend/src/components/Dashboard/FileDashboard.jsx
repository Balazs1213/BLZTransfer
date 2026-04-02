import React, { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { getDownloadUrl, getUserFiles } from "../../api/fileApi";
import styles from "./FileDashboard.module.css";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
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
    extractedText: safeFile.extractedText ?? safeFile.ExtractedText ?? "",
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

const FileDashboard = ({ userId = "guest", apiUrl, t = (key) => key }) => {
  const executeDownloadBaseUrl =
    "https://h8sikvnc4a.execute-api.us-east-1.amazonaws.com/default/blz-execute-download";

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getUserFiles(apiUrl, userId);
        const normalized = Array.isArray(response)
          ? response.map(normalizeFile)
          : [];

        if (isMounted) {
          setFiles(normalized);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load files.");
          setFiles([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFiles();

    return () => {
      isMounted = false;
    };
  }, [apiUrl, userId]);

  const handleGenerate = async (file, type, durationMinutes, downloads) => {
    const safeMinutes = Math.max(1, Number(durationMinutes) || 1);
    const safeDownloads = Math.max(1, Number(downloads) || 1);
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
    return <section className={styles.state}>{t("noFilesFound")}</section>;
  }

  return (
    <>
      <section className={styles.dashboard}>
        {files.map((file, index) => {
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
                {isActive && (
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

                {isExpired && (
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
                {t("validFor")} (minutes)
              </label>
              <select
                id="durationSelect"
                className={styles.durationSelect}
                value={selectedDuration}
                onChange={(e) =>
                  setSelectedDuration(Number(e.target.value) || 1)
                }
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={15}>15</option>
                <option value={60}>60</option>
              </select>

              <label
                htmlFor="maxDownloadsInput"
                className={styles.durationLabel}
              >
                Max allowed downloads:
              </label>
              <input
                id="maxDownloadsInput"
                type="number"
                min={1}
                step={1}
                className={styles.durationSelect}
                value={maxDownloads}
                onChange={(e) =>
                  setMaxDownloads(Math.max(1, Number(e.target.value) || 1))
                }
              />
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
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() =>
                    handleGenerate(
                      selectedFile,
                      "link",
                      selectedDuration,
                      maxDownloads,
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
                      selectedDuration,
                      maxDownloads,
                    )
                  }
                  disabled={isGenerating}
                >
                  {isGenerating ? t("generating") : t("getQrCode")}
                </button>
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
    </>
  );
};

export default FileDashboard;
