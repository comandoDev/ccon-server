import { Router } from 'express'

import LikeController from '../features/Like/LikeController'
import PostController from '../features/Post/PostController'
import UserController from '../features/User/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

class AuthRouter {
  private authRouter = Router()

  route (): Router {
    this.authRouter.use(authMiddleware)

    this.authRouter.use('/users', UserController)
    this.authRouter.use('/posts', PostController)
    this.authRouter.use('/likes', LikeController)

    return this.authRouter
  }
}

const authRouter = new AuthRouter()
export default authRouter.route()
