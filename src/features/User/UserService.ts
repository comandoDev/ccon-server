import { Types } from 'mongoose'

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

  async findAll (): Promise<Array<UserModel>> {
    return await this.userRepositoryImp.findAll()
  }

  async update (
    userId: Types.ObjectId,
    properties: Partial<IUser>
  ): Promise<void> {
    if (properties.email) await this.validateDuplicatedEmail(properties.email)

    const updated = await this.userRepositoryImp.modifyProperties(
      userId,
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

    return await this.userRepositoryImp.create(user)

    // await MailServer.sendActiveUserMail(createdUser._id!, createdUser.object.email)

    // return createdUser
  }

  async active (userId: string): Promise<void> {
    const user = await this.findById(userId)

    if (user.active) throw CustomResponse.CONFLICT('Usuário já ativado!')

    await this.update(ObjectId(userId), { active: true })
  }

  async isAdmin (userId: Types.ObjectId): Promise<boolean> {
    const user = await this.findById(userId.toString())

    return !!user.object.admin
  }

  private async validateDuplicatedEmail (email: string): Promise<void> {
    const existsEmail = await this.userRepositoryImp.findByEmail(email)

    if (existsEmail) throw CustomResponse.CONFLICT('Email já cadastrado!')
  }
}
