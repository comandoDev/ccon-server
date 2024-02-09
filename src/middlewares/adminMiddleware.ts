import { NextFunction, Request, Response } from 'express'

import CustomResponse from '../utils/CustomResponse'

export const adminMiddleware = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { user } = request

    console.log({ user })

    if (!user.admin) throw CustomResponse.FORBIDDEN('Acesso negado!')

    next()
  }
}
