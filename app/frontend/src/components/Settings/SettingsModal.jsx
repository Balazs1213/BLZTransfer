import { useEffect, useRef } from "react";
import { GiCancel } from "react-icons/gi";
import classes from "./SettingsModal.module.css";

const SettingsModal = ({ onClose, language, setLanguage, t }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div
        className={classes.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeButtonRef}
          className={classes.closeButton}
          onClick={onClose}
          aria-label={t("close")}
        >
          <GiCancel className={classes.closeIcon} aria-hidden="true" />
        </button>

        <h2 id="settings-modal-title" className={classes.title}>
          {t("settings")}
        </h2>

        <div className={classes.fieldGroup}>
          <label htmlFor="settings-language" className={classes.label}>
            {t("language")}
          </label>
          <select
            id="settings-language"
            className={classes.select}
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English (en)</option>
            <option value="hu">Magyar (hu)</option>
            <option value="de">Deutsch (de)</option>
          </select>
        </div>

        {/* Future: dark mode toggle will be added here. */}
        <div className={classes.placeholder} />
      </div>
    </div>
  );
};

export default SettingsModal;
