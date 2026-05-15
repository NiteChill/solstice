export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateEmail = () => ({
  required: 'Email is required',
  maxLength: {
    value: 255,
    message: 'Email cannot exceed 255 characters',
  },
  pattern: {
    value: EMAIL_PATTERN,
    message: 'Please enter a valid email address',
  },
});

export const validatePassword = () => ({
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  maxLength: {
    value: 100,
    message: 'Password cannot exceed 100 characters',
  },
});

export const validateName = () => ({
  required: 'Name is required',
  maxLength: {
    value: 50,
    message: 'Name cannot exceed 50 characters',
  },
});

export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export const validateUsername = () => ({
  required: 'Username is required',
  minLength: {
    value: 3,
    message: 'Username must be at least 3 characters',
  },
  maxLength: {
    value: 20,
    message: 'Username cannot exceed 20 characters',
  },
  pattern: {
    value: USERNAME_PATTERN,
    message: 'Username must be alphanumeric and underscores only',
  },
});

export const validateBio = () => ({
  maxLength: {
    value: 255,
    message: 'Bio cannot exceed 255 characters',
  },
});

export const validateIdentifier = () => ({
  required: 'Username or email is required',
});
