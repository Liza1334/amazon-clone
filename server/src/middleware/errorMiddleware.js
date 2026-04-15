export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    success: false,
    data: null,
    message
  })
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}