import {
  Button,
  Chip,
  Description,
  Dropdown,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  TextField,
} from '@heroui/react';
import { AsyncButtonContent } from '../../../components/async-button-content';
import { CustomAvatar } from '../../../components/custom-avatar';
import { Controller } from 'react-hook-form';
import { useProfileSection } from '../hooks/use-profile-section';
import {
  validateBio,
  validateName,
  validateUsername,
} from '../../../utils/validators';
import { Pencil, Trash } from 'lucide-react';

import { useDeleteAvatar } from '../hooks/use-delete-avatar';

export const ProfileSection = () => {
  const {
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
  } = useProfileSection();

  const { mutate: deleteAvatar } = useDeleteAvatar();

  return (
    <Form
      key={resetKey}
      className="flex flex-col flex-1 items-center gap-2 px-4 pb-4 pt-1 animate-in zoom-in-96 fade-in"
      onSubmit={onSubmit}
    >
      <Dropdown>
        <Button variant="ghost" className="h-fit w-fit p-0 rounded-full">
          <CustomAvatar
            fallbackClassName="text-5xl"
            user={user!}
            className="size-30"
          />
          <Chip size="lg" className="absolute top-21.5 left-16 gap-2">
            <Pencil className="size-3" /> Edit
          </Chip>
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#settings/profile/upload-avatar"
              id="upload-avatar"
              textValue="Upload avatar"
            >
              <Pencil className="size-3.5 text-muted" />
              <Label>Upload {user!.profilePicture && 'new'} avatar</Label>
            </Dropdown.Item>
            {user?.profilePicture && (
              <Dropdown.Item
                id="remove-avatar"
                textValue="Remove avatar"
                variant="danger"
                onPress={() => deleteAvatar()}
              >
                <Trash className="size-3.5 text-danger" />
                <Label>Remove avatar</Label>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <Controller
        name="name"
        control={control}
        rules={validateName()}
        render={({ field }) => (
          <TextField
            fullWidth
            type="text"
            isInvalid={!!errors.name}
            value={field.value || ''}
            onChange={field.onChange}
          >
            <Label>Name</Label>
            <Input
              variant="secondary"
              name={field.name}
              placeholder="John"
              maxLength={50}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="username"
        control={control}
        rules={validateUsername()}
        render={({ field }) => (
          <TextField
            fullWidth
            type="text"
            isInvalid={isUsernameInvalid}
            value={field.value || ''}
            onChange={field.onChange}
          >
            <Label>Username</Label>
            <InputGroup variant="secondary">
              <InputGroup.Prefix>solstice.com/</InputGroup.Prefix>
              <InputGroup.Input
                name={field.name}
                placeholder="john_002"
                maxLength={20}
              />
              {getUsernameSuffix()}
            </InputGroup>
            <Description>
              Must be at least 3 characters and alphanumeric
            </Description>
            <FieldError>{usernameErrorMessage}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="bio"
        control={control}
        rules={validateBio()}
        render={({ field }) => (
          <TextField
            fullWidth
            type="text"
            isInvalid={!!errors.bio}
            value={field.value || ''}
            onChange={field.onChange}
          >
            <Label>Bio</Label>
            <InputGroup variant="secondary">
              <InputGroup.TextArea
                className="resize-none"
                name={field.name}
                placeholder="Tell us about yourself"
                rows={3}
                maxLength={500}
              />
            </InputGroup>
            <FieldError>{errors.bio?.message}</FieldError>
          </TextField>
        )}
      />
      <div className="flex justify-end gap-2 w-full mt-2">
        <Button
          type="button"
          variant="tertiary"
          isDisabled={!isDirty}
          onPress={handleReset}
        >
          Reset
        </Button>
        <Button type="submit" isDisabled={isTrimSame} isPending={isPending}>
          <AsyncButtonContent
            isLoading={isPending}
            loadingText="Updating..."
            idleText="Update profile"
          />
        </Button>
      </div>
    </Form>
  );
};
