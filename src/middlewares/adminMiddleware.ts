import { NextFunction, Request, Response } from 'express'

import CustomResponse from '../utils/CustomResponse'

export const adminMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const { user } = request

  if (!user.admin) throw CustomResponse.FORBIDDEN('Acesso negado!')

  next()
}
