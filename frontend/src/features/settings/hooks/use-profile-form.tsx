import { useCallback, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { InputGroup, Spinner } from '@heroui/react';
import { CheckIcon, XIcon } from 'lucide-react';

import { useAuth } from '../../auth/hooks/use-auth';
import { useUpdateProfile } from './use-update-profile';
import { useCheckUsernameAvailability } from './use-check-username-availability';
import type { UpdateProfileRequest } from '../../../types/settings';
import { USERNAME_PATTERN } from '../../../utils/validators';
import { trimValues } from '../../../utils/form-utils';

export const useProfileForm = () => {
  const { user } = useAuth();
  const form = useForm<UpdateProfileRequest>({
    values: {
      name: user!.name,
      username: user!.username,
      bio: user!.bio,
    },
  });

  const {
    setError,
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const { mutate, isPending } = useUpdateProfile(setError);

  const [resetKey, setResetKey] = useState(0);
  const username = useWatch({ control, name: 'username' });
  const name = useWatch({ control, name: 'name' });
  const bio = useWatch({ control, name: 'bio' });

  const isTrimSame =
    name?.trim() === user!.name &&
    username?.trim() === user!.username &&
    (bio?.trim() || '') === (user!.bio || '');

  const handleReset = useCallback(() => {
    reset();
    setResetKey((k) => k + 1);
  }, [reset]);

  const [debouncedUsername, setDebouncedUsername] = useState(user!.username);
  useDebounce(
    () => {
      setDebouncedUsername(username);
    },
    400,
    [username],
  );

  const shouldCheckAvailability =
    debouncedUsername !== user!.username &&
    debouncedUsername.length >= 3 &&
    debouncedUsername.length <= 20 &&
    USERNAME_PATTERN.test(debouncedUsername);

  const {
    data: isAvailable,
    isFetching: isCheckingUsername,
    isError: isUsernameCheckError,
  } = useCheckUsernameAvailability({
    username: debouncedUsername,
    enabled: shouldCheckAvailability,
  });

  const isUsernameInvalid =
    !!errors.username || (shouldCheckAvailability && isAvailable === false);

  const usernameErrorMessage =
    errors.username?.message ||
    (shouldCheckAvailability && isAvailable === false
      ? 'This username is already taken'
      : null);

  const getUsernameSuffix = () => {
    if (isUsernameCheckError) return null;

    let content = null;
    if (isCheckingUsername) content = <Spinner color="current" size="sm" />;
    else if (shouldCheckAvailability && isAvailable)
      content = <CheckIcon className="text-success" />;
    else if (shouldCheckAvailability && isAvailable === false)
      content = <XIcon className="text-danger" />;

    if (!content) return null;

    return <InputGroup.Suffix>{content}</InputGroup.Suffix>;
  };

  const onSubmit = handleSubmit((data: UpdateProfileRequest) => {
    const trimmedData = trimValues(data);
    const changedData: Partial<UpdateProfileRequest> = {};

    if (trimmedData.name !== user!.name) changedData.name = trimmedData.name;
    if (trimmedData.username !== user!.username)
      changedData.username = trimmedData.username;
    if (trimmedData.bio !== user!.bio) changedData.bio = trimmedData.bio;

    if (Object.keys(changedData).length > 0) {
      mutate(changedData as UpdateProfileRequest);
    }
  });

  return {
    user,
    control,
    errors,
    isDirty,
    resetKey,
    handleReset,
    onSubmit,
    isPending,
    isTrimSame,
    isUsernameInvalid,
    usernameErrorMessage,
    getUsernameSuffix,
  };
};
