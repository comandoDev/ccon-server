import { NextFunction, Request, Response, Router } from 'express'

import multer from '../config/multer'
import UserAuthenticationController from '../features/User/Authentication/UserAuthenticationController'
import { S3Middleware } from '../middlewares/S3'

class UnauthRouter {
  private unauthRouter = Router()

  route (): Router {
    this.unauthRouter.post('/upload',
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

    this.unauthRouter.use('/users', UserAuthenticationController)

    return this.unauthRouter
  }
}

const unauthRouter = new UnauthRouter()
export default unauthRouter.route()
