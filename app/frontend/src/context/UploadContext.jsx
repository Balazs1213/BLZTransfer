import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { UploadContext } from "./UploadContextState";

export const UploadProvider = ({ children }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const addUploadingFile = useCallback((file, userId) => {
    const tempId = `upload-${userId}-${file.name}-${file.lastModified}-${Date.now()}`;
    const tempFile = {
      id: tempId,
      fileName: file.name,
      originalName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      status: "Uploading",
      userId,
      isUploading: true,
    };

    setUploadingFiles((currentFiles) => [tempFile, ...currentFiles]);
    return tempId;
  }, []);

  const removeUploadingFile = useCallback((tempId) => {
    setUploadingFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== tempId),
    );
  }, []);

  const clearUploadingFiles = useCallback(() => {
    setUploadingFiles([]);
  }, []);

  const value = useMemo(
    () => ({
      uploadingFiles,
      addUploadingFile,
      removeUploadingFile,
      clearUploadingFiles,
    }),
    [
      addUploadingFile,
      clearUploadingFiles,
      removeUploadingFile,
      uploadingFiles,
    ],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

UploadProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
