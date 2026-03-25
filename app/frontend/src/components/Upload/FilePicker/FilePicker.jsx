import React, { useRef } from 'react';
import Dropzone from '../../UI/Dropzone/Dropzone';
import ProgressBar from '../../UI/Feedback/ProgressBar/ProgressBar'; 
import classes from './FilePicker.module.css';

const FilePicker = ({ 
  onFileSelect, 
  isUploading, 
  progress, 
  statusText, 
  currentStatus 
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
        style={{ display: 'none' }} 
        onChange={(e) => onFileSelect(e.target.files[0])}
        disabled={isUploading} // Letiltjuk a bevitelt feltöltés közben
      />
      
      <Dropzone 
        onFilesDropped={isUploading ? () => {} : onFileSelect} 
        onClick={selectFileHandler}
      >
        <p>Drag & Drop your file here</p>
        <span>or click to browse</span>
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

export default FilePicker;