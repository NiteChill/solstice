import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/**
 * Iterates through Spring Boot validation errors and applies them to React Hook Form.
 *
 * @param serverErrors - The map of field names to error messages (e.g., { email: "Invalid" })
 * @param setError - The setError function directly from useForm()
 */
export const applyServerErrors = <T extends FieldValues>(
  serverErrors: Record<string, string>,
  setError: UseFormSetError<T>,
) => {
  Object.keys(serverErrors).forEach((field) => {
    setError(field as Path<T>, {
      type: 'server',
      message: serverErrors[field],
    });
  });
};
