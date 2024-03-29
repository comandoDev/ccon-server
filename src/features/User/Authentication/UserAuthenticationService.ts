import Bcrypt from '../../../libraries/Bcrypt'
import Jwt from '../../../libraries/Jwt'
import { IUserAuthenticatedProps, IUserTokenPayload, UserModel } from '../../../models/User/UserModel'
import CustomResponse from '../../../utils/CustomResponse'
import { UserServiceImp } from '../UserController'

export class UserAuthenticationService {
  async signIn (email: string, password: string): Promise<IUserAuthenticatedProps> {
    const user = await UserServiceImp.findByEmail(email)
    if (!user) throw CustomResponse.NOT_FOUND('Usuario não cadastrado!', { email })

    if (!user.active) throw CustomResponse.FORBIDDEN('Usuário desativado!', { email })

    const isValid = await Bcrypt.compare(password, user.object.password)
    if (!isValid) throw CustomResponse.UNPROCESSABLE_ENTITY('Senha incorreta!')

    return this.generateAuthenticatedProps(user)
  }

  async signUp (user: UserModel): Promise<IUserAuthenticatedProps> {
    const createdUser = await UserServiceImp.create(user)

    return this.generateAuthenticatedProps(createdUser)
  }

  private generateAuthenticatedProps (user: UserModel): IUserAuthenticatedProps {
    const token = this.generateAccessToken({
      userId: user._id,
      admin: user.object.admin,
      avatar: user.object.avatar,
      departament: user.object.departament,
      email: user.object.email,
      name: user.object.name
    })

    return {
      token,
      user: user.object
    }
  }

  private generateAccessToken (payload: IUserTokenPayload): string {
    const token = Jwt.generate(payload)
    if (!token) throw CustomResponse.INTERNAL_SERVER_ERROR('Não foi possível gerar o token de acesso!')

    return token
  }
}
