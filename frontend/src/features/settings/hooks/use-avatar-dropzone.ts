import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const useAvatarDropzone = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
    });

  return {
    previewUrl,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    clearPreview,
  };
};
