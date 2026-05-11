import { Home, Search, Send, User } from 'lucide-react';
import type { UserResponse } from '../types/auth';
import { Avatar } from '@heroui/react';
import type { Location } from 'react-router-dom';

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
    icon: (
      <Avatar className={`size-${iconSize} bg-transparent`}>
        <Avatar.Image alt="Profile" src={user?.profilePicture} />
        <User className={`size-${iconSize}`} />
      </Avatar>
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
