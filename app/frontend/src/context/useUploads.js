import { useContext } from "react";
import { UploadContext } from "./UploadContextState";

export const useUploads = () => {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error("useUploads must be used within an UploadProvider");
  }

  return context;
};
