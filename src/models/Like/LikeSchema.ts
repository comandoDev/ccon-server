import mongoose, { AggregatePaginateModel, Document, Types } from 'mongoose'

import Schema from '../../core/Schema'
import PostMongoDB from '../../models/Post/PostMongoDB'
import UserMongoDB from '../../models/User/UserMongoDB'
import { ILike } from './LikeModel'

export interface ILikeDocument extends Document, Omit<ILike, '_id'> { }

export interface ILikeMongoDB extends AggregatePaginateModel<ILike> { }

class LikeSchema extends Schema<ILikeDocument> {
  constructor () {
    const like = new mongoose.Schema({
      userId: {
        type: Types.ObjectId,
        ref: UserMongoDB,
        require: true
      },
      postId: {
        type: Types.ObjectId,
        ref: PostMongoDB,
        require: true
      },
      createdAt: Date
    })

    super(like)
  }
}

export default new LikeSchema()
