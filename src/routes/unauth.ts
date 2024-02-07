import { Router } from 'express'

class UnauthRouter {
  private unauthRouter = Router()

  route (): Router {
    return this.unauthRouter
  }
}

const unauthRouter = new UnauthRouter()
export default unauthRouter.route()
