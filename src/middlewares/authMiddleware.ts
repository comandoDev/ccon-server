import { NextFunction, Request, Response } from 'express'

import { UserServiceImp } from '../features/User/UserController'
import Jwt from '../libraries/Jwt'
import CustomResponse from '../utils/CustomResponse'

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const authorization = request.headers.authorization
    if (!authorization) throw CustomResponse.UNAUTHORIZED('Acesso negado!')

    const [schema, token] = authorization.split(' ')
    if (!token || schema.toUpperCase() !== 'BEARER') throw CustomResponse.UNAUTHORIZED('Acesso negado!')

    const { userId } = Jwt.decode(token)

    const user = await UserServiceImp.findById(userId)

    if (!user.active) throw CustomResponse.FORBIDDEN('Acesso negado!')

    request.user = user.object

    next()
  } catch (error) {
    next(error)
  }
}
