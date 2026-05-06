import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileAlt,
  FaFileArchive,
} from "react-icons/fa";
import styles from "../components/Dashboard/FileDashboard.module.css";

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

export const toNumberOrNull = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

export const getFileExtension = (file) => {
  const sourceName = String(file?.fileName || file?.originalName || "");
  const dotIndex = sourceName.lastIndexOf(".");
  if (dotIndex <= -1 || dotIndex === sourceName.length - 1) {
    return "";
  }

  return sourceName.slice(dotIndex + 1).toLowerCase();
};

export const getFileIcon = (fileName) => {
  const extension = getFileExtension({ fileName });

  if (extension === "pdf") return FaFilePdf;

  if (
    [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "bmp",
      "svg",
      "heic",
      "heif",
    ].includes(extension)
  ) {
    return FaFileImage;
  }

  if (["mp4", "mov", "avi", "mkv", "webm", "m4v"].includes(extension)) {
    return FaFileVideo;
  }

  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)) {
    return FaFileAudio;
  }

  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return FaFileArchive;
  }

  return FaFileAlt;
};

export const getFileIconClassName = (fileName) => {
  const extension = getFileExtension({ fileName });

  if (extension === "pdf") return styles.fileIconPdf;

  if (
    [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "bmp",
      "svg",
      "heic",
      "heif",
    ].includes(extension)
  ) {
    return styles.fileIconImage;
  }

  if (["mp4", "mov", "avi", "mkv", "webm", "m4v"].includes(extension)) {
    return styles.fileIconVideo;
  }

  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)) {
    return styles.fileIconAudio;
  }

  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return styles.fileIconArchive;
  }

  return styles.fileIconDefault;
};

export const getUploadTimestamp = (file) => {
  const date = new Date(file?.uploadDate || "");
  const timestamp = date.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getIsInactive = (file) => {
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

export const normalizeFile = (file) => {
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

export const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export const formatFileSize = (bytes) => {
  const numericBytes = Number(bytes);
  if (!Number.isFinite(numericBytes) || numericBytes < 0) {
    return "0.0 KB";
  }

  const units = ["KB", "MB", "GB"];
  let value = numericBytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

export const extractPreview = (text) => {
  if (!text || typeof text !== "string") return "";

  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed.length > 100 ? `${trimmed.slice(0, 100)}...` : trimmed;
};

export const getFileId = (file, fallbackIndex = 0) => {
  return file?.fileName || file?.originalName || `file-${fallbackIndex}`;
};

export const formatRemaining = (remainingMs) => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const getFilteredAndSortedFiles = ({
  files,
  searchTerm,
  activeStateFilter,
  avStatusFilter,
  categoryFilter,
  extFilter,
  sortOrder,
}) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filtered = files.filter((file) => {
    const fileName = String(file?.fileName || "").toLowerCase();
    const originalName = String(file?.originalName || "").toLowerCase();
    const tags = [...toArray(file?.tags), ...toArray(file?.aiLabels)]
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.toLowerCase());

    const searchMatches =
      normalizedSearch === "" ||
      fileName.includes(normalizedSearch) ||
      originalName.includes(normalizedSearch) ||
      tags.some((tag) => tag.includes(normalizedSearch));

    const inactive = getIsInactive(file);
    const activeStateMatches =
      activeStateFilter === "ALL" ||
      (activeStateFilter === "ACTIVE" && !inactive) ||
      (activeStateFilter === "INACTIVE" && inactive);

    const avStatusMatches =
      avStatusFilter === "ALL" || file?.status === avStatusFilter;

    const categoryMatches =
      categoryFilter === "ALL" || file?.category === categoryFilter;

    const extensionMatches =
      extFilter === "ALL" || `.${getFileExtension(file)}` === extFilter;

    return (
      searchMatches &&
      activeStateMatches &&
      avStatusMatches &&
      categoryMatches &&
      extensionMatches
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
};
