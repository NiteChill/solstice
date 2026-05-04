let accessToken: string | null = null;

interface setTokensProps {
  access: string;
}

export const setTokens = ({ access }: setTokensProps) => {
  accessToken = access;
};

export const getAccessToken = (): string | null => accessToken;

export const hasSessionCookie = (): boolean =>
  document.cookie.includes('solstice_session=true');

export const clearTokens = (): void => {
  accessToken = null;
};
