import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { formatRemaining } from "../../utils/fileHelpers";

const FileModals = ({
  selectedFile,
  fileToDelete,
  showReplaceModal,
  setSelectedFile,
  setFileToDelete,
  setShowReplaceModal,
  setModalError,
  t,
  styles,
  isGuestUser,
  userId,
  selectedDuration,
  setSelectedDuration,
  maxDownloads,
  setMaxDownloads,
  modalError,
  activeSelectedState,
  copyFeedback,
  isGenerating,
  handleGenerate,
  handleRevoke,
  copyToClipboard,
  translateStatusValue,
  translateCategoryValue,
  confirmAndDelete,
  confirmReplaceFile,
  formatDate,
}) => {
  return (
    <>
      {selectedFile && (
        <div className={styles.modalOverlay}>
          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label={t("close")}
            onClick={() => setSelectedFile(null)}
          />
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{selectedFile.originalName}</h3>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("statusLabel")}</span>{" "}
              {translateStatusValue(selectedFile.status)}
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>{t("categoryLabel")}</span>{" "}
              {translateCategoryValue(selectedFile.category)}
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
        <div className={styles.modalOverlay}>
          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label={t("close")}
            onClick={() => setFileToDelete(null)}
          />
          <div className={styles.modalContent}>
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
        <div className={styles.modalOverlay}>
          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label={t("close")}
            onClick={() => setShowReplaceModal(false)}
          />
          <div className={styles.modalContent}>
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

FileModals.propTypes = {
  selectedFile: PropTypes.shape({
    originalName: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    uploadDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  fileToDelete: PropTypes.shape({
    originalName: PropTypes.string,
  }),
  showReplaceModal: PropTypes.bool.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  setFileToDelete: PropTypes.func.isRequired,
  setShowReplaceModal: PropTypes.func.isRequired,
  setModalError: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  isGuestUser: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  selectedDuration: PropTypes.number.isRequired,
  setSelectedDuration: PropTypes.func.isRequired,
  maxDownloads: PropTypes.number.isRequired,
  setMaxDownloads: PropTypes.func.isRequired,
  modalError: PropTypes.string,
  activeSelectedState: PropTypes.shape({
    status: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
    remainingSeconds: PropTypes.number,
    fileId: PropTypes.string,
  }),
  copyFeedback: PropTypes.string,
  isGenerating: PropTypes.bool.isRequired,
  handleGenerate: PropTypes.func.isRequired,
  handleRevoke: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.func.isRequired,
  translateStatusValue: PropTypes.func.isRequired,
  translateCategoryValue: PropTypes.func.isRequired,
  confirmAndDelete: PropTypes.func.isRequired,
  confirmReplaceFile: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default FileModals;
