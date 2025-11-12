export class ApiResponse {
  constructor({ data = null, success = true, message = 'OK' }) {
    this.data = data;
    this.success = success;
    this.message = message;
  }
}
