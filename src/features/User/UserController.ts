import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../core/Controller'
import { UserModel } from '../../models/User/UserModel'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import { UserRules } from './UserRules'
import { UserService } from './UserService'

export const UserServiceImp = new UserService(
  UserRepositoryImp
)

class UserAuthenticationController extends Controller {
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

    this.router.post('/', async (request: Request, response: Response, next: NextFunction) => {
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
          { gender },
          { departament },
          { avatar, isRequiredField: false }
        )

        const userModel = new UserModel(request.body)

        const createdUser = await UserServiceImp.create(userModel)

        response.OK('Usuário cadastrado com sucesso!', {
          createdUser
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.patch('/:userId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { userId } = request.params

        const {
          biotype,
          height,
          weight,
          coachId,
          name,
          gender,
          age,
          objectiveId,
          email
        } = request.body

        this.rules.validate(
          { biotype, isRequiredField: false },
          { height, isRequiredField: false },
          { weight, isRequiredField: false },
          { coachId, isRequiredField: false },
          { name, isRequiredField: false },
          { gender, isRequiredField: false },
          { age, isRequiredField: false },
          { objectiveId, isRequiredField: false },
          { email, isRequiredField: false },
          { userId, isRequiredField: false }
        )

        await UserServiceImp.update(
          userId,
          request.body
        )

        response.OK('Usuário atualizado com sucesso!', {
          userId
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
