export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    message: string,
    isOperational: boolean = true,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.isOperational = isOperational;

    // Ensure proper inheritance for built-in `Error` class
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
export default AppError;
