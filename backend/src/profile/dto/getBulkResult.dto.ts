import AppError from 'src/utility/AppError';
class getBulkResult<T> {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | Error | null = null;
  data?: T = null;
  constructor(success: boolean, message: string, data: T = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
  static fail<T>(message: string): getBulkResult<T> {
    const result = new getBulkResult<T>(false, message);
    return result;
  }
  static success<T>(message: string, data: T): getBulkResult<T> {
    const result = new getBulkResult<T>(true, message, data);
    return result;
  }
}
export default getBulkResult;
