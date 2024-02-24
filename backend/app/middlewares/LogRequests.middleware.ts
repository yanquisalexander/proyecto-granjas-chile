import { Request, Response, NextFunction } from 'express'
import { Loggers } from '../initializers/create_loggers'

const PARAMS_TO_FILTER = [
  'password',
  'password_confirmation',
  'token'
]

function filterSensitiveParams (data: any): any {
  // Recorre las claves sensibles y filtra su valor en el objeto de datos
  PARAMS_TO_FILTER.forEach((param) => {
    if (data[param]) {
      data[param] = 'FILTERED'
    }
  })

  return data
}

export default function LogRequestsMiddleware (req: Request, res: Response, next: NextFunction) {
  Loggers.WebServer.writeLog(`[${req.method}] ${req.originalUrl}`)

  // Si es una solicitud POST o PUT, filtra los parámetros sensibles en el cuerpo
  if (req.method === 'POST' || req.method === 'PUT') {
    const filteredBody = filterSensitiveParams({ ...req.body })
    Loggers.WebServer.writeLog(`[${req.method}] ${req.originalUrl} - Body: ${JSON.stringify(filteredBody)}`)
  }

  // También puedes agregar lógica para filtrar parámetros en otros lugares, como en los parámetros de consulta (req.query)

  next()
}
