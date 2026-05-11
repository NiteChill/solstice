import type { ReactNode } from 'react';

interface HeaderProps {
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const Header = ({ leftSlot, centerSlot, rightSlot }: HeaderProps) => {
  return (
    <header className="flex items-center px-4 h-16 md:hidden">
      {(leftSlot || centerSlot) && (
        <div className="flex flex-1 items-center gap-2">{leftSlot}</div>
      )}
      {centerSlot && (
        <div className="flex items-center gap-2">{centerSlot}</div>
      )}
      {(rightSlot || centerSlot) && (
        <div className="flex flex-1 items-center justify-end gap-2">
          {rightSlot}
        </div>
      )}
    </header>
  );
};
