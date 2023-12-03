class AppError extends Error {
  /** Start Variables **/
  statusCode: number;
  status: string;
  isOperational: boolean;
  /** End Variables **/

  /** Start constructor **/
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
  /** End constructor **/
}

export default AppError;
