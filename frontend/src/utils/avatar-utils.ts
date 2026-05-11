export const getInitials = (value: string) => {
  const splitValue = value.split(' ');
  if (splitValue.length > 1)
    return splitValue[0].charAt(0) + splitValue[1].charAt(0);
  return value.slice(0, 2).toUpperCase();
};
