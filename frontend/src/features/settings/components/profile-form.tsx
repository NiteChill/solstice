import {
  Button,
  Description,
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
import { useProfileForm } from '../hooks/use-profile-form';
import {
  validateBio,
  validateName,
  validateUsername,
} from '../../../utils/validators';

export const ProfileForm = () => {
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
  } = useProfileForm();

  return (
    <Form
      key={resetKey}
      className="flex flex-col flex-1 items-center pt-4 gap-2"
      onSubmit={onSubmit}
    >
      <CustomAvatar
        fallbackClassName="text-5xl"
        user={user!}
        className="size-30"
      />
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
          size="sm"
          isDisabled={!isDirty}
          onPress={handleReset}
        >
          Reset
        </Button>
        <Button
          type="submit"
          size="sm"
          isDisabled={isTrimSame}
          isPending={isPending}
        >
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
