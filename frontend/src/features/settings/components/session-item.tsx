import { Button, Card, Disclosure, Label } from '@heroui/react';
import type { SessionResponse } from '../../../types/auth';
import { getDeviceIcon } from '../../../utils/sessionIconMapper';
import { useRevokeSession } from '../hooks/use-delete-session';
import { AsyncButtonContent } from '../../../components/async-button-content';
import { formatLocalTime } from '../../../utils/date-utils';
import { useAuth } from '../../auth/hooks/use-auth';
import { SessionItemSkeleton } from './session-item-skeleton';

interface SessionItemProps {
  session: SessionResponse;
  isExpanded: boolean;
  isEven: boolean;
}

type SessionItemType = typeof SessionItemRoot & {
  Skeleton: typeof SessionItemSkeleton;
};

export const SessionItemRoot = ({
  session,
  isExpanded,
  isEven,
}: SessionItemProps) => {
  const { id, device, browser, os, location, lastActive, isCurrent } = session;
  const { mutate, isPending } = useRevokeSession();
  const { logout } = useAuth();
  const handleClick = () => {
    if (isCurrent) {
      logout();
      return;
    }
    mutate(id);
  };
  return (
    <Disclosure className="flex flex-col w-full" key={id} id={id}>
      <Disclosure.Heading className="w-full">
        <Button
          slot="trigger"
          variant="ghost"
          className={`w-full focus-visible:z-50 ${isExpanded ? 'text-foreground' : 'text-muted'} ${isEven ? 'bg-surface-secondary/50 hover:bg-surface-secondary/80' : 'bg-surface hover:bg-surface-secondary/30'}`}
        >
          <div className="flex flex-1 items-center justify-start gap-2">
            {getDeviceIcon(device)}
            {browser} on {os}
          </div>
          <Disclosure.Indicator className="text-muted" />
        </Button>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Card variant="secondary" className="flex-row my-2 items-center">
          <div className="flex flex-col flex-1 overflow-hidden">
            <Label className="text-ellipsis text-nowrap overflow-hidden">
              {location}
            </Label>
            <p className="text-xs text-ellipsis text-nowrap overflow-hidden">
              {isCurrent ? 'Current session' : formatLocalTime(lastActive)}
            </p>
          </div>
          <Button
            variant="danger-soft"
            onPress={handleClick}
            isPending={isPending}
          >
            {isCurrent ? (
              'Logout'
            ) : (
              <AsyncButtonContent
                isLoading={isPending}
                loadingText="Revoking..."
                idleText="Revoke"
              />
            )}
          </Button>
        </Card>
      </Disclosure.Content>
    </Disclosure>
  );
};

export const SessionItem = SessionItemRoot as SessionItemType;

SessionItem.Skeleton = SessionItemSkeleton;
