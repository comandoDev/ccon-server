import { Types } from 'mongoose'

import { IUpdateDocumentProps, Repository } from '../../core/Repository'
import { CommentModel, IComment } from './CommentModel'
import { ICommentMongoDB } from './CommentSchema'

export class CommentRepository extends Repository<ICommentMongoDB, CommentModel> {
  async findById (id: Types.ObjectId): Promise<CommentModel | null> {
    const document = await this.mongoDB.findOne({
      _id: id
    })
    if (!document) return null

    return new CommentModel(document)
  }

  async findByPostIdAndUserId (postId: Types.ObjectId, userId: Types.ObjectId): Promise<CommentModel | null> {
    const document = await this.mongoDB.findOne({
      postId,
      userId
    })
    if (!document) return null

    return new CommentModel(document)
  }

  async findAllByPostId (postId: Types.ObjectId): Promise<Array<CommentModel>> {
    const documents = await this.mongoDB.find({
      postId
    })

    const models = documents.map(document => new CommentModel(document))

    return models
  }

  async create (comment: CommentModel): Promise<CommentModel> {
    const document = await this.mongoDB.create(comment.object)
    return new CommentModel(document)
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
    data: Partial<IComment>
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
