import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../core/Controller'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import { UserRules } from './UserRules'
import { UserService } from './UserService'

export const UserServiceImp = new UserService(
  UserRepositoryImp
)

class UserController extends Controller {
  protected rules = new UserRules()

  handle (): Router {
    this.router.get('/:userId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { userId } = request.params

        this.rules.validate(
          { userId }
        )

        const user = await UserServiceImp.findById(userId)

        response.OK('Usuário encontrado com sucesso!', {
          user: user.show
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.patch('/', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = request

        const {
          avatar,
          name,
          gender,
          email,
          departament
        } = request.body

        this.rules.validate(
          { name, isRequiredField: false },
          { email, isRequiredField: false },
          { gender, isRequiredField: false },
          { departament, isRequiredField: false },
          { avatar, isRequiredField: false }
        )

        await UserServiceImp.update(
          user._id!,
          request.body
        )

        response.OK('Usuário atualizado com sucesso!')
      } catch (error) {
        next(error)
      }
    })

    return this.router
  }
}

const userController = new UserController()
export default userController.handle()
