import { DisclosureGroup } from '@heroui/react';
import { useGetSessions } from '../../auth/hooks/use-get-sessions';
import { SessionItem } from './session-item';
import { useState } from 'react';

export const SessionsSection = () => {
  const { data: sessions, isLoading } = useGetSessions();
  const [expandedKeys, setExpandedKeys] = useState(new Set<number | string>());
  return (
    <div className="flex flex-col px-4 pb-4 pt-1 animate-in zoom-in-96 fade-in">
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <SessionItem.Skeleton key={index} isEven={index % 2 === 0} />
        ))}
      <DisclosureGroup
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        className="flex flex-col"
      >
        {sessions &&
          sessions.map((session, index) => (
            <SessionItem
              key={session.id}
              session={session}
              isExpanded={expandedKeys.has(session.id)}
              isEven={index % 2 === 0}
            />
          ))}
      </DisclosureGroup>
    </div>
  );
};
