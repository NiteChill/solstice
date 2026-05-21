import { useCallback, useEffect, useState } from 'react';
import { useAvatarCrop } from './use-avatar-crop';
import { useAvatarDropzone } from './use-avatar-dropzone';

import { useLocation, useNavigate } from 'react-router-dom';
import { useUploadAvatar } from './use-upload-avatar';

export const useUploadAvatarSection = () => {
  const dropzone = useAvatarDropzone();
  const crop = useAvatarCrop();
  const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCancel = useCallback(() => {
    dropzone.clearPreview();
    crop.resetCrop();
  }, [dropzone, crop]);

  const handleUpload = useCallback(async () => {
    if (!dropzone.previewUrl) return;
    const blob = await crop.exportCrop(dropzone.previewUrl);
    await uploadAvatar(blob);
    navigate(location.pathname + '#settings/profile');
  }, [dropzone, crop, uploadAvatar, navigate, location]);

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (!dropzone.previewUrl) return;

    const img = new Image();
    img.src = dropzone.previewUrl;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [dropzone.previewUrl]);

  return {
    previewUrl: dropzone.previewUrl,
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
    isDragActive: dropzone.isDragActive,
    isDragReject: dropzone.isDragReject,

    crop: crop.crop,
    setCrop: crop.setCrop,
    zoom: crop.zoom,
    setZoom: crop.setZoom,
    onCropComplete: crop.onCropComplete,

    handleCancel,
    handleUpload,
    isPending,
    isPortrait,
  };
};
