import AppError from 'src/utility/AppError';
class createProfileResult<T> {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | Error | null = null;
  data?: T = null;
  constructor(success: boolean, message: string, data: T = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
  static fail<T>(message: string): createProfileResult<T> {
    const result = new createProfileResult<T>(false, message);
    return result;
  }
  static success<T>(message: string, data: T): createProfileResult<T> {
    const result = new createProfileResult<T>(true, message, data);
    return result;
  }
}
export default createProfileResult;
