import type { ComponentType } from 'react';
import { ProfileSection } from './components/profile-section';
import { SessionsSection } from './components/sessions-section';
import { KeyRound, MonitorSmartphone, Settings2, User } from 'lucide-react';
import { PasswordSection } from './components/password-section';
import { PreferencesSection } from './components/preferences-section';

type SettingsRoute = {
  path: string;
  label: string;
  component: ComponentType;
  icon: ComponentType;
};

export const settingsRouter: SettingsRoute[] = [
  {
    path: 'profile',
    label: 'Profile',
    component: ProfileSection,
    icon: User,
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
