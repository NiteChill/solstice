import { Spinner } from '@heroui/react';
import type { ReactNode } from 'react';

interface AsyncButtonContentProps {
  isLoading: boolean;
  loadingText: string;
  idleText: ReactNode;
}

export const AsyncButtonContent = ({
  isLoading,
  loadingText,
  idleText,
}: AsyncButtonContentProps) => {
  return isLoading ? (
    <>
      <Spinner color="current" size="sm" />
      {loadingText}
    </>
  ) : (
    idleText
  );
};
