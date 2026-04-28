/**
 * Standardized API Response format
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - The HTTP status code
   * @param {any} data - The payload to send
   * @param {string} [message="Success"] - The success message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
