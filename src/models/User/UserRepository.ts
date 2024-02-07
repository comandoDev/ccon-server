import { Types } from 'mongoose'

import { IUpdateDocumentProps, Repository } from '../../core/Repository'
import { IUser, UserModel } from './UserModel'
import { IUserMongoDB } from './UserSchema'

export class UserRepository extends Repository<IUserMongoDB, UserModel> {
  async findById (id: Types.ObjectId): Promise<UserModel | null> {
    const document = await this.mongoDB.findOne({
      _id: id
    })
    if (!document) return null

    return new UserModel(document)
  }

  async findByEmail (email: string): Promise<UserModel | null> {
    const document = await this.mongoDB.findOne({
      email
    })
    if (!document) return null

    return new UserModel(document)
  }

  async create (user: UserModel): Promise<UserModel> {
    const document = await this.mongoDB.create(user.object)
    return new UserModel(document)
  }

  async delete (
    id: Types.ObjectId
  ): Promise<boolean> {
    const deleted = await this.mongoDB.deleteOne({
      _id: id
    })

    return Boolean(deleted.deletedCount)
  }

  async update ({
    id,
    data
  }: IUpdateDocumentProps): Promise<boolean> {
    const updated = await this.mongoDB.updateOne(
      {
        _id: id
      }, {
        $set: data.object
      }
    )

    return Boolean(updated.modifiedCount)
  }

  async modifyProperties (
    id: Types.ObjectId,
    data: Partial<IUser>
  ): Promise<boolean> {
    const updated = await this.mongoDB.updateOne(
      {
        _id: id
      },
      { $set: data }
    )

    return Boolean(updated.modifiedCount)
  }
}
