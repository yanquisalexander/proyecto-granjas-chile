import { type Request, type Response, type NextFunction } from 'express'

interface ApiResponse {
  data: any
  success: boolean
  status_code: number
}

export default function FormatApiResponseMiddleware (req: Request, res: Response, next: NextFunction) {
  // Is OK status?
  const isOk = res.statusCode >= 200 && res.statusCode < 300
  // Create response object
  const response: ApiResponse = {
    data: res.locals,
    success: isOk,
    status_code: res.statusCode
  }
  // Send response
  res.status(res.statusCode).json(response)
}
