export class CustomResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;

  constructor(success: boolean, data: T, message: string, statusCode: number) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
