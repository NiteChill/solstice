let accessToken: string | null = null;
let refreshToken: string | null = null;

interface setTokensProps {
  access: string;
  refresh: string;
}

export const setTokens = ({ access, refresh }: setTokensProps) => {
  accessToken = access;
  refreshToken = refresh;
  if (refresh) localStorage.setItem('solstice_rt', refresh);
};

export const getAccessToken = (): string | null => accessToken;
export const getRefreshToken = (): string | null =>
  refreshToken || localStorage.getItem('solstice_rt');

export const clearTokens = (): void => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('solstice_rt');
};
