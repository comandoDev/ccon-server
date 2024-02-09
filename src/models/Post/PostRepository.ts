import { Aggregate, Types } from 'mongoose'

import { IUpdateDocumentProps, Repository } from '../../core/Repository'
import { IPost, IPostListFilters, PostModel } from './PostModel'
import { IPostMongoDB } from './PostSchema'

export class PostRepository extends Repository<IPostMongoDB, PostModel> {
  async findById (id: Types.ObjectId): Promise<PostModel | null> {
    const document = await this.mongoDB.findOne({
      _id: id
    })
    if (!document) return null

    return new PostModel(document)
  }

  async create (post: PostModel): Promise<PostModel> {
    const document = await this.mongoDB.create(post.object)
    return new PostModel(document)
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
    data: Partial<IPost>
  ): Promise<boolean> {
    const updated = await this.mongoDB.updateOne(
      {
        _id: id
      },
      { $set: data }
    )

    return Boolean(updated.modifiedCount)
  }

  async list ({ limit, page, ...filters }: IPostListFilters): Promise<any> {
    filters.active = true

    const aggregationStages: Aggregate<Array<any>> = this.mongoDB.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ])

    return await this.mongoDB.aggregatePaginate(
      aggregationStages,
      {
        limit,
        page
      })
  }
}
