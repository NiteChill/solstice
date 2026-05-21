export const getInitials = (value: string) => {
  const splitValue = value.split(' ');
  if (splitValue.length > 1)
    return splitValue[0].charAt(0) + splitValue[1].charAt(0);
  return value.slice(0, 2).toUpperCase();
};

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, '');

export const getAvatarSrc = (
  path: string | undefined | null,
  useThumb = false,
): string | undefined => {
  if (!path) return undefined;

  const extension = useThumb ? '_thumb.webp' : '.webp';
  return `${ROOT_URL}${path}${extension}`;
};
