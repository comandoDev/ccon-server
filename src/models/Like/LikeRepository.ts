import { Types } from 'mongoose'

import { IUpdateDocumentProps, Repository } from '../../core/Repository'
import { ILike, LikeModel } from './LikeModel'
import { ILikeMongoDB } from './LikeSchema'

export class LikeRepository extends Repository<ILikeMongoDB, LikeModel> {
  async findById (id: Types.ObjectId): Promise<LikeModel | null> {
    const document = await this.mongoDB.findOne({
      _id: id
    })
    if (!document) return null

    return new LikeModel(document)
  }

  async findByPostIdAndUserId (postId: Types.ObjectId, userId: Types.ObjectId): Promise<LikeModel | null> {
    const document = await this.mongoDB.findOne({
      postId,
      userId
    })
    if (!document) return null

    return new LikeModel(document)
  }

  async findAllByPostId (postId: Types.ObjectId): Promise<Array<LikeModel>> {
    const documents = await this.mongoDB.find({
      postId
    })

    const models = documents.map(document => new LikeModel(document))

    return models
  }

  async create (like: LikeModel): Promise<LikeModel> {
    const document = await this.mongoDB.create(like.object)
    return new LikeModel(document)
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
    data: Partial<ILike>
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
