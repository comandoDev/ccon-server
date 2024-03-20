import mongoose, { AggregatePaginateModel, Document, Types } from 'mongoose'

import Schema from '../../core/Schema'
import PostMongoDB from '../Post/PostMongoDB'
import UserMongoDB from '../User/UserMongoDB'
import { IComment } from './CommentModel'

export interface ICommentDocument extends Document, Omit<IComment, '_id'> { }

export interface ICommentMongoDB extends AggregatePaginateModel<IComment> { }

class CommentSchema extends Schema<ICommentDocument> {
  constructor () {
    const comment = new mongoose.Schema({
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
      text: {
        type: String,
        require: true
      },
      createdAt: Date
    })

    super(comment)
  }
}

export default new CommentSchema()
