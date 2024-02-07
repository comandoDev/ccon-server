import { Types } from 'mongoose'

import MailServer from '../../apis/MailServer'
import { IUser, UserModel } from '../../models/User/UserModel'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'

export class UserService {
  constructor (
    private userRepositoryImp: typeof UserRepositoryImp
  ) {
    this.userRepositoryImp = userRepositoryImp
  }

  async findById (userId: string): Promise<UserModel> {
    const user = await this.userRepositoryImp.findById(ObjectId(userId))

    if (!user) {
      throw CustomResponse.NOT_FOUND('Usuário não cadastrado!', {
        userId
      })
    }

    return user
  }

  async findByEmail (email: string): Promise<UserModel> {
    const user = await this.userRepositoryImp.findByEmail(email)

    if (!user) {
      throw CustomResponse.NOT_FOUND('Usuário não cadastrado!', {
        email
      })
    }

    return user
  }

  async update (
    userId: string,
    properties: Partial<IUser>
  ): Promise<void> {
    if (properties.email) await this.validateDuplicatedEmail(properties.email)

    const updated = await this.userRepositoryImp.modifyProperties(
      ObjectId(userId),
      properties
    )

    if (!updated) {
      throw CustomResponse.INTERNAL_SERVER_ERROR('Não foi possível atualizar usuário!', {
        userId
      })
    }
  }

  async create (user: UserModel): Promise<UserModel> {
    user._id = new Types.ObjectId()

    await this.validateDuplicatedEmail(user.object.email)

    const createdUser = await this.userRepositoryImp.create(user)

    await MailServer.sendActiveUserMail(createdUser._id!, createdUser.object.email)

    return createdUser
  }

  private async validateDuplicatedEmail (email: string): Promise<void> {
    const existsEmail = await this.userRepositoryImp.findByEmail(email)

    if (existsEmail) throw CustomResponse.CONFLICT('Email já cadastrado!')
  }
}
