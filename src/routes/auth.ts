import { NextFunction, Request, Response, Router } from 'express'

import multer from '../config/multer'
import CommentController from '../features/Comment/CommentController'
import LikeController from '../features/Like/LikeController'
import PostController from '../features/Post/PostController'
import UserController from '../features/User/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { S3Middleware } from '../middlewares/S3'

class AuthRouter {
  private authRouter = Router()

  route (): Router {
    this.authRouter.use(authMiddleware)

    this.authRouter.post('/upload',
      multer.single('image'),
      S3Middleware,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          response.OK('Arquivo gravado com sucesso!', {
            file: request.filePath
          })
        } catch (error) {
          next(error)
        }
      })

    this.authRouter.use('/users', UserController)
    this.authRouter.use('/posts', PostController)
    this.authRouter.use('/likes', LikeController)
    this.authRouter.use('/comments', CommentController)

    return this.authRouter
  }
}

const authRouter = new AuthRouter()
export default authRouter.route()
