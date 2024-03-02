import { Request, Response, NextFunction } from 'express'
import { Loggers } from '../services/loggers'

const PARAMS_TO_FILTER = [
  'password',
  'password_confirmation',
  'token'
]

function filterSensitiveParams (data: any): any {
  // Recorre las claves sensibles y filtra su valor en el objeto de datos
  // Clone the object to avoid modifying the original
  data = { ...data }
  for (const param of PARAMS_TO_FILTER) {
    if (data[param]) {
      data[param] = 'FILTERED'
    }
  }

  return data
}

export default function LogRequestsMiddleware (req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, body, query, ip, headers } = req

  // Filtra los parámetros sensibles en el cuerpo (solo para POST y PUT)
  const filteredBody = (method === 'POST' || method === 'PUT') ? filterSensitiveParams(body) : null

  // Construye un objeto con la información relevante de la solicitud
  const requestInfo = {
    method,
    originalUrl,
    ip,
    query,
    body: filteredBody,
    headers: {
      contentType: headers['content-type'],
      contentLength: headers['content-length']
    }
  }

  // Loggea toda la información relevante de la solicitud en líneas separadas
  Loggers.WebServer.writeLog(`Incoming request:
  Method: ${requestInfo.method}
  URL: ${requestInfo.originalUrl}
  IP: ${requestInfo.ip}
  Query: ${JSON.stringify(requestInfo.query)}
  Body: ${JSON.stringify(requestInfo.body)}
  Headers: ${JSON.stringify(requestInfo.headers)}
  `)

  // Continúa con el siguiente middleware
  next()
}
