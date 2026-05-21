import Cropper from 'react-easy-crop';
import { Button, buttonVariants, Slider } from '@heroui/react';
import { Ban, PackageOpen, Upload, UploadCloud } from 'lucide-react';
import { useUploadAvatarSection } from '../hooks/use-upload-avatar-section';
import { AsyncButtonContent } from '../../../components/async-button-content';

export const UploadAvatarSection = () => {
  const {
    previewUrl,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    handleCancel,
    handleUpload,
    isPending,
    isPortrait,
  } = useUploadAvatarSection();

  return (
    <div className="flex flex-col min-h-full px-4 pb-4 pt-1 animate-in zoom-in-96 fade-in">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={buttonVariants({
            fullWidth: true,
            variant: 'ghost',
            className: `border-2 border-dashed rounded-xl p-10 flex flex-1 flex-col ease-(--ease-out-fuid) duration-100 items-center justify-center text-center ${isDragReject ? 'text-danger border-danger bg-danger/10' : isDragActive ? 'text-accent border-accent bg-accent/10' : 'ring-accent ring-0 transition-all duration-200 ring-offset-0 ring-offset-background border-border hover:border-muted hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-offset-2'}`,
          })}
        >
          <input {...getInputProps()} />

          {isDragReject ? (
            <Ban className="size-8" />
          ) : isDragActive ? (
            <PackageOpen className="size-8" />
          ) : (
            <UploadCloud className="size-8 text-muted" />
          )}
          <div className="flex flex-col items-center">
            <p className="font-semibold">
              {isDragReject
                ? 'Only JPG, PNG and WebP files are allowed'
                : isDragActive
                  ? 'Drop the image here...'
                  : 'Click or drag an image here'}
            </p>
            <p className="text-sm text-muted">Max size 5MB. JPG, PNG or WebP</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 animate-in zoom-in-96 fade-in">
          <div className="flex flex-1 flex-col gap-2 items-center justify-center">
            <div className="relative size-64 sm:size-70 md:size-60 rounded-3xl overflow-hidden outline-2 outline-border shadow-sm">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                objectFit="cover"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={1}
                maxZoom={4}
                classes={{
                  mediaClassName: isPortrait ? 'min-w-full' : 'min-w-fit',
                  cropAreaClassName: 'text-black/30!',
                }}
              />
            </div>
            <Slider
              aria-label="Zoom"
              minValue={1}
              maxValue={4}
              step={0.01}
              value={zoom}
              onChange={(value) => setZoom(value as number)}
              className="w-56 sm:w-64 md:w-56"
            >
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="tertiary"
              onPress={handleCancel}
              isDisabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onPress={handleUpload}
              isPending={isPending}
              isDisabled={isPending}
            >
              <AsyncButtonContent
                idleText={
                  <>
                    <Upload />
                    Upload
                  </>
                }
                isLoading={isPending}
                loadingText="Uploading..."
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
