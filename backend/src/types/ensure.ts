import { HttpError } from './http-error.js';

export const ensure: (value: unknown, message?: string | Error) => asserts value = (
  value,
  message
) => {
  const isFalsy = value == null || value === false;
  if (!isFalsy) {
    return;
  }
  if (message instanceof Error) {
    throw message;
  }
  throw new HttpError(message ?? 'Something went wrong');
};
