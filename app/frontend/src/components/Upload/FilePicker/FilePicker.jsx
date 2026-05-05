import React, { useRef } from "react";
import PropTypes from "prop-types";
import Dropzone from "../../UI/Dropzone/Dropzone";
import ProgressBar from "../../UI/Feedback/ProgressBar/ProgressBar";
import classes from "./FilePicker.module.css";

const FilePicker = ({
  onFileSelect,
  isUploading,
  progress,
  statusText,
  currentStatus,
  t,
}) => {
  const fileInputRef = useRef();

  const selectFileHandler = () => {
    // Ha épp töltünk fel, ne lehessen rákattintani újra
    if (!isUploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={classes.container}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e.target.files[0])}
        disabled={isUploading} // Letiltjuk a bevitelt feltöltés közben
      />

      <Dropzone
        onFilesDropped={isUploading ? () => {} : onFileSelect}
        onClick={selectFileHandler}
      >
        <p>{t("dragDrop")}</p>
        <span>{t("orClick")}</span>
      </Dropzone>

      {/* A folyamatjelző csík csak akkor jelenik meg, ha elindult a feltöltés */}
      {(isUploading || progress > 0) && (
        <ProgressBar
          progress={progress}
          text={statusText}
          currentStatus={currentStatus}
        />
      )}
    </div>
  );
};

FilePicker.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  statusText: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default FilePicker;
