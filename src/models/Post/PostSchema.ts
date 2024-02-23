import mongoose, { AggregatePaginateModel, Document, Types } from 'mongoose'

import Schema from '../../core/Schema'
import UserMongoDB from '../User/UserMongoDB'
import { IPost } from './PostModel'

export interface IPostDocument extends Document, Omit<IPost, '_id'> { }

export interface IPostMongoDB extends AggregatePaginateModel<IPost> { }

class PostSchema extends Schema<IPostDocument> {
  constructor () {
    const post = new mongoose.Schema({
      file: String,
      pinned: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: true
      },
      body: {
        type: String,
        require: true
      },
      userId: {
        type: Types.ObjectId,
        require: true,
        ref: UserMongoDB
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    })

    super(post)
  }
}

export default new PostSchema()
