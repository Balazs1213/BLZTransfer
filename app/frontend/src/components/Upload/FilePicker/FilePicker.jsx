import React, { useRef } from 'react';
import Dropzone from '../../UI/Dropzone/Dropzone';
import classes from './FilePicker.module.css';

const FilePicker = (props) => {
  const fileInputRef = useRef();

  const selectFileHandler = () => fileInputRef.current.click();

  return (
    <div className={classes.container}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{display: 'none'}} 
        onChange={(e) => props.onFileSelect(e.target.files[0])}
      />
      
      <Dropzone 
        onFilesDropped={props.onFileSelect} 
        onClick={selectFileHandler}
      >
        <p>Drag & Drop your file here</p>
        <span>or click to browse</span>
      </Dropzone>
    </div>
  );
};

export default FilePicker;