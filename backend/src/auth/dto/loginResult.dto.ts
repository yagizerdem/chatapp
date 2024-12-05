import AppError from 'src/utility/AppError';

class LogInResult<T> {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | null = null;
  data?: T = null;
  constructor(success: boolean, message: string, data: T = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
  static fail<T>(message: string): LogInResult<T> {
    const result = new LogInResult<T>(false, message);
    return result;
  }
  static success<T>(message: string, data: T): LogInResult<T> {
    const result = new LogInResult<T>(true, message, data);
    return result;
  }
}

export default LogInResult;
