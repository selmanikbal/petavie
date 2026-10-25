/**
 * User-facing error for data operations.
 * Screens render `error.message` directly, so it must always be readable
 * Turkish copy — never a raw backend string.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function toUserFacingError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof TypeError) {
    return new AppError('İnternet bağlantına ulaşamadık. Bağlantını kontrol edip tekrar dene.');
  }

  return new AppError('Beklenmedik bir sorun oldu. Lütfen tekrar dene.');
}
