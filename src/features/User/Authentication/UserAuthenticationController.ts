import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../../core/Controller'
import { UserModel } from '../../../models/User/UserModel'
import { UserServiceImp } from '../UserController'
import { UserRules } from '../UserRules'

class UserAuthenticationController extends Controller {
  protected rules = new UserRules()

  handle (): Router {
    this.router.post('/signup', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const {
          avatar,
          name,
          gender,
          email,
          password,
          passwordConfirmation,
          departament
        } = request.body

        this.rules.validate(
          { name },
          { email },
          { password },
          { passwordsMatch: [password, passwordConfirmation] },
          { departament },
          { gender, isRequiredField: false },
          { avatar, isRequiredField: false }
        )

        const userModel = new UserModel(request.body)

        const createdUser = await UserServiceImp.create(userModel)

        response.CREATED('Usuário cadastrado com sucesso!', {
          createdUser
        })
      } catch (error) {
        next(error)
      }
    })

    return this.router
  }
}

const userAuthenticationController = new UserAuthenticationController()
export default userAuthenticationController.handle()
