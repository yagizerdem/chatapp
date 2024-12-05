import AppError from 'src/utility/AppError';

class ServiceResponseDto<T> {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | null = null;
  data?: T = null;
  constructor(success: boolean, message: string, data: T = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
  static fail<T>(message: string): ServiceResponseDto<T> {
    const result = new ServiceResponseDto<T>(false, message);
    return result;
  }
  static success<T>(message: string, data: T): ServiceResponseDto<T> {
    const result = new ServiceResponseDto<T>(true, message, data);
    return result;
  }
}

export default ServiceResponseDto;
