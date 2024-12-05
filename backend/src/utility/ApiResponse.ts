export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;

  constructor(statusCode: number, message: string, path: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString(); // Automatically generate timestamp
    this.path = path; // Set path explicitly
  }
}
export default ApiResponse;
