import AppError from 'src/utility/AppError';
class RegisterResult {
  success?: boolean = false;
  message?: string | null = null;
  error?: AppError | null = null;
  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
  static fail(message: string): RegisterResult {
    const result = new RegisterResult(false, message);
    return result;
  }
  static success(message: string): RegisterResult {
    const result = new RegisterResult(true, message);
    return result;
  }
}

export default RegisterResult;
