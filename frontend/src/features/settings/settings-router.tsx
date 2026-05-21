import { SessionsSection } from './components/sessions-section';
import { KeyRound, MonitorSmartphone, Settings2, User } from 'lucide-react';
import { PasswordSection } from './components/password-section';
import { PreferencesSection } from './components/preferences-section';
import type { SettingsRoute } from '../../types/settings';
import { UploadAvatarSection } from './components/upload-avatar-section';
import { ProfileSection } from './components/profile-section';

export const SETTINGS_ROUTES: SettingsRoute[] = [
  {
    path: 'profile',
    label: 'Profile',
    component: ProfileSection,
    icon: User,
    children: [
      {
        path: 'upload-avatar',
        label: 'Upload avatar',
        component: UploadAvatarSection,
      },
    ],
  },
  {
    path: 'password',
    label: 'Password',
    component: PasswordSection,
    icon: KeyRound,
  },
  {
    path: 'sessions',
    label: 'Sessions',
    component: SessionsSection,
    icon: MonitorSmartphone,
  },
  {
    path: 'preferences',
    label: 'Preferences',
    component: PreferencesSection,
    icon: Settings2,
  },
];
