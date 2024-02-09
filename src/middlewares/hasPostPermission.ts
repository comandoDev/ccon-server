import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

import { PostServiceImp } from '../features/Post/PostController'
import CustomResponse from '../utils/CustomResponse'

export const hasPostPermission = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { user, params } = request

    if (!Types.ObjectId.isValid(params.postId)) throw CustomResponse.UNPROCESSABLE_ENTITY('Identificador de publicação inválido!')

    const post = await PostServiceImp.findById(params.postId)

    if (!post.userId.equals(user._id)) throw CustomResponse.FORBIDDEN('Você não possui acesso para alterar essa publicação!')

    next()
  } catch (error) {
    next(error)
  }
}
