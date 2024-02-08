import { Router } from 'express'

import UserController from '../features/User/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

class AuthRouter {
  private authRouter = Router()

  route (): Router {
    this.authRouter.use(authMiddleware)

    this.authRouter.use('/users', UserController)

    return this.authRouter
  }
}

const authRouter = new AuthRouter()
export default authRouter.route()
