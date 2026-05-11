import { Avatar, type AvatarProps } from '@heroui/react';
import type { UserResponse } from '../types/auth';
import { getInitials } from '../utils/avatar-utils';

interface CustomAvatarProps extends AvatarProps {
  user: UserResponse;
}

export const CustomAvatar = ({ user, ...props }: CustomAvatarProps) => (
  <Avatar variant="soft" color="accent" {...props}>
    <Avatar.Image src={user.profilePicture} alt="Profile" />
    <Avatar.Fallback>{getInitials(user.displayName)}</Avatar.Fallback>
  </Avatar>
);
