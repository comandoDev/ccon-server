import Bcrypt from '../../../libraries/Bcrypt'
import Jwt from '../../../libraries/Jwt'
import { IUserAuthenticatedProps, IUserTokenPayload, UserModel } from '../../../models/User/UserModel'
import CustomResponse from '../../../utils/CustomResponse'
import { UserServiceImp } from '../UserController'

export class UserAuthenticationService {
  async signIn (email: string, password: string): Promise<IUserAuthenticatedProps> {
    const user = await UserServiceImp.findByEmail(email)
    if (!user) throw CustomResponse.NOT_FOUND('Usuario não cadastrado!', { email })

    const isValid = await Bcrypt.compare(password, user.object.password)
    if (!isValid) throw CustomResponse.UNPROCESSABLE_ENTITY('Senha incorreta!')

    return this.generateAuthenticatedProps(user)
  }

  private generateAuthenticatedProps (user: UserModel): IUserAuthenticatedProps {
    const token = this.generateAccessToken({ userId: user._id! })

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
