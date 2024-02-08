import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../../core/Controller'
import { UserModel } from '../../../models/User/UserModel'
import { UserServiceImp } from '../UserController'
import { UserRules } from '../UserRules'
import { UserAuthenticationService } from './UserAuthenticationService'

const UserAuthenticationServiceImp = new UserAuthenticationService()

class UserAuthenticationController extends Controller {
  protected rules = new UserRules()

  handle (): Router {
    this.router.post('/signin', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const {
          email,
          password
        } = request.body

        this.rules.validate(
          { email },
          { password }
        )

        const userAuthenticatedProps = await UserAuthenticationServiceImp.signIn(
          email,
          password
        )

        response.OK('Login efetuado com sucesso!', userAuthenticatedProps)
      } catch (error) {
        next(error)
      }
    })

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

    this.router.get('/:userId/active', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { userId } = request.params

        this.rules.validate(
          { userId }
        )

        await UserServiceImp.active(userId)

        response.OK('Usuário ativado com sucesso!')
      } catch (error) {
        next(error)
      }
    })

    return this.router
  }
}

const userAuthenticationController = new UserAuthenticationController()
export default userAuthenticationController.handle()
