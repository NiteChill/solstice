export const validateEmail = () => ({
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address',
  },
});

export const validatePassword = () => ({
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
});

export const validateDisplayName = () => ({ required: 'Username is required' });

export const validateUsername = () => ({
  required: 'Username or email is required',
});
