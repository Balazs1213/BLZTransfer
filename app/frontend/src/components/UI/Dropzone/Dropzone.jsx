import React, { useState } from 'react';
import {MdCloudUpload} from 'react-icons/md';
import classes from './Dropzone.module.css';

const Dropzone = (props) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const dragOverHandler = (event) => {
    event.preventDefault(); // Megakadályozzuk, hogy a böngésző megnyissa a fájlt
    setIsDragOver(true);
  };

  const dragLeaveHandler = () => {
    setIsDragOver(false);
  };

  const dropHandler = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      props.onFilesDropped(event.dataTransfer.files[0]); // Átadjuk a fájlt
    }
  };

  return (
    <div 
      className={`${classes.dropzone} ${isDragOver ? classes.active : ''}`}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
      onClick={props.onClick} 
    >
      <MdCloudUpload />
      {props.children}
    </div>
  );
};

export default Dropzone;