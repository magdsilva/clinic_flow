import { ErrorRequestHandler } from 'express'
import { DatabaseError } from 'pg'
import { errorDetails, logger } from '../config/logger'

const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  logger.error('request.failed', {
    request_id: request.requestId,
    error: errorDetails(error),
  })

  if (response.headersSent) {
    _next(error)
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({
      message: 'Malformed JSON body'
    })
    return
  }

  if (error instanceof DatabaseError) {
    if (error.code === '22P02' || error.code === '22007' || error.code === '22008') {
      response.status(400).json({
        message: 'Invalid request data'
      })
      return
    }

    if (error.code === '23503') {
      response.status(409).json({
        message: 'Operation violates a related resource constraint'
      })
      return
    }

    if (error.code === '23505') {
      response.status(409).json({
        message: 'Resource already exists or conflicts with existing data'
      })
      return
    }

    if (error.code === '23514') {
      response.status(400).json({
        message: 'Request violates a data constraint'
      })
      return
    }
  }

  response.status(500).json({
    message: 'Internal server error'
  })
}

export { errorHandler }
