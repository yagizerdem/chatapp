import AppError from 'src/utility/AppError';
class getProfileResult<T> {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | Error | null = null;
  data?: T = null;
  constructor(success: boolean, message: string, data: T = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
  static fail<T>(message: string): getProfileResult<T> {
    const result = new getProfileResult<T>(false, message);
    return result;
  }
  static success<T>(message: string, data: T): getProfileResult<T> {
    const result = new getProfileResult<T>(true, message, data);
    return result;
  }
}
export default getProfileResult;
