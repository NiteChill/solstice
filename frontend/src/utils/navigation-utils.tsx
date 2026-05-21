import { Home, Search, Send, User } from 'lucide-react';
import type { UserResponse } from '../types/auth';
import { Avatar } from '@heroui/react';
import type { Location } from 'react-router-dom';
import { getAvatarSrc } from './avatar-utils';

interface GetOptionsProps {
  user: UserResponse | null;
  iconSize?: number;
}

export const getOptions = ({ user, iconSize = 5 }: GetOptionsProps) => [
  {
    icon: <Home className={`size-${iconSize}`} />,
    id: '/home',
    label: 'Home',
  },
  {
    icon: <Send className={`size-${iconSize}`} />,
    id: '/messages',
    label: 'Messages',
  },
  {
    icon: <Search className={`size-${iconSize}`} />,
    id: '/search',
    label: 'Search',
  },
  {
    icon: user?.profilePicture ? (
      <Avatar
        className={`size-${iconSize + 1} -mx-0.5 border`}
        variant="soft"
        color="accent"
      >
        <Avatar.Image
          alt="Profile"
          src={getAvatarSrc(user.profilePicture, true)}
        />
      </Avatar>
    ) : (
      <User className={`size-${iconSize}`} />
    ),
    id: '/profile',
    label: 'Profile',
  },
];

interface GetSelectedKeyProps {
  user: UserResponse | null;
  location: Location;
}

export const getSelectedKey = ({ user, location }: GetSelectedKeyProps) => {
  const l = location.pathname;
  const option = getOptions({ user }).find((opt) => l.startsWith(opt.id));
  return option?.id;
};
