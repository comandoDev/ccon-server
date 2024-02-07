import { Router } from 'express'

class AuthRouter {
  private authRouter = Router()

  route (): Router {
    return this.authRouter
  }
}

const authRouter = new AuthRouter()
export default authRouter.route()
