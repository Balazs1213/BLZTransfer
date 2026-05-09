import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { BsTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import {
  extractPreview,
  formatFileSize,
  getFileIcon,
  getFileIconClassName,
  getFileId,
  toArray,
} from "../../utils/fileHelpers";

const FileCardGrid = ({
  filteredAndSortedFiles,
  setSelectedFile,
  setFileToDelete,
  isGuestUser,
  userId,
  t,
  styles,
  renderActiveStateLabel,
  translateStatusValue,
  translateCategoryValue,
  getDerivedLinkState,
  handleRevoke,
  formatDate,
}) => {
  return filteredAndSortedFiles.map((file, index) => {
    const labels = toArray(file.aiLabels).filter(
      (label) => typeof label === "string" && label.trim(),
    );
    const textPreview = extractPreview(file.extractedText);
    const cardKey = `${getFileId(file, index)}-${index}`;
    const isUploading = Boolean(file.isUploading);
    const derivedState = isUploading
      ? { status: "uploading" }
      : getDerivedLinkState(file, index);
    const isActive = derivedState.status === "active";
    const isExpired = derivedState.status === "expired";
    const FileIcon = getFileIcon(file.originalName);
    const fileIconClassName = getFileIconClassName(file.originalName);

    const cardClasses = [styles.card];
    if (isUploading) cardClasses.push(styles.cardUploading);
    if (isActive) cardClasses.push(styles.cardActive);
    if (isExpired) cardClasses.push(styles.cardExpired);
    const cardProps = isUploading
      ? {
          "aria-label": `${file.originalName} is uploading`,
        }
      : {
          role: "button",
          tabIndex: 0,
          onClick: () => setSelectedFile(file),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedFile(file);
            }
          },
          "aria-label": `Open details for ${file.originalName}`,
        };

    return (
      <article
        key={cardKey}
        className={`${cardClasses.join(" ")} ${
          isUploading ? "" : styles.cardButton
        }`}
        {...cardProps}
      >
        <h3 className={styles.fileName}>
          <FileIcon
            className={`${styles.fileIcon} ${fileIconClassName}`}
            aria-hidden="true"
          />
          {file.originalName}
        </h3>

        {isUploading ? (
          <>
            <div className={styles.uploadingBadge}>
              <FiClock className={styles.statusIconUploading} />
              <span>{t("msg_uploading") || "Uploading..."}</span>
            </div>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("sizeLabel")}:</span>{" "}
              {formatFileSize(file.fileSize)}
            </p>
          </>
        ) : (
          <>
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
              <span className={styles.metaLabel}>{t("sizeLabel")}:</span>{" "}
              {formatFileSize(file.fileSize)}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("statusLabel")}</span>{" "}
              {translateStatusValue(file.status)}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("categoryLabel")}</span>{" "}
              {translateCategoryValue(file.category)}
            </p>

            {labels.length > 0 && (
              <div className={styles.labelsWrap}>
                {labels.map((label, labelIndex) => (
                  <span key={`${label}-${labelIndex}`} className={styles.badge}>
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
          </>
        )}
      </article>
    );
  });
};

FileCardGrid.propTypes = {
  filteredAndSortedFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  setFileToDelete: PropTypes.func.isRequired,
  isGuestUser: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  renderActiveStateLabel: PropTypes.func.isRequired,
  translateStatusValue: PropTypes.func.isRequired,
  translateCategoryValue: PropTypes.func.isRequired,
  getDerivedLinkState: PropTypes.func.isRequired,
  handleRevoke: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  sizeLabel: PropTypes.string,
};

export default FileCardGrid;
