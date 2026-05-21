export const formatLocalTime = (isoString: string) => {
  if (!isoString) return 'Unknown date';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
