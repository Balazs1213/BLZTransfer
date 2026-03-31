import React, { useEffect, useMemo, useState } from "react";
import { getUserFiles } from "../../api/fileApi";
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

const FileDashboard = ({ userId = "guest", apiUrl }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const hasFiles = useMemo(() => files.length > 0, [files]);

  if (loading) {
    return <section className={styles.state}>Loading files...</section>;
  }

  if (error) {
    return (
      <section className={`${styles.state} ${styles.error}`}>
        Error: {error}
      </section>
    );
  }

  if (!hasFiles) {
    return (
      <section className={styles.state}>No files found for this user.</section>
    );
  }

  return (
    <>
      <section className={styles.dashboard}>
        {files.map((file, index) => {
          const labels = toArray(file.aiLabels).filter(
            (label) => typeof label === "string" && label.trim(),
          );
          const textPreview = extractPreview(file.extractedText);
          const cardKey = `${file.fileName || file.originalName || "file"}-${index}`;

          return (
            <article
              key={cardKey}
              className={styles.card}
              onClick={() => setSelectedFile(file)}
            >
              <h3 className={styles.fileName}>{file.originalName}</h3>

              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>Uploaded:</span>{" "}
                {formatDate(file.uploadDate)}
              </p>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>Status:</span> {file.status}
              </p>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>Category:</span>{" "}
                {file.category}
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
              <span className={styles.metaLabel}>Status:</span>{" "}
              {selectedFile.status}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Category:</span>{" "}
              {selectedFile.category}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Uploaded:</span>{" "}
              {formatDate(selectedFile.uploadDate)}
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => console.log("Get Download Link", selectedFile)}
              >
                Get Download Link
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => console.log("Get QR Code", selectedFile)}
              >
                Get QR Code
              </button>
            </div>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setSelectedFile(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDashboard;
