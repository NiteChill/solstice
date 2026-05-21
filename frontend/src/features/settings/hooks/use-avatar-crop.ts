import { useCallback, useRef, useState } from 'react';
import type { Area, Point } from 'react-easy-crop';

const AVATAR_OUTPUT_SIZE = 512;

export const useAvatarCrop = () => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      croppedAreaPixelsRef.current = croppedAreaPixels;
    },
    [],
  );

  const exportCrop = useCallback(async (imageUrl: string): Promise<Blob> => {
    const area = croppedAreaPixelsRef.current;
    if (!area) throw new Error('No crop area available');

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Failed to load image'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(
      image,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      AVATAR_OUTPUT_SIZE,
      AVATAR_OUTPUT_SIZE,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/webp',
        0.85,
      );
    });
  }, []);

  const resetCrop = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    croppedAreaPixelsRef.current = null;
  }, []);

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    exportCrop,
    resetCrop,
  };
};
