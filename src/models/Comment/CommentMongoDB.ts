import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

import database from '../../config/database'
import { CommentRepository } from './CommentRepository'
import CommentSchema, { ICommentDocument, ICommentMongoDB } from './CommentSchema'

const commentSchema = CommentSchema.schema

commentSchema.plugin(aggregatePaginate)

const CommentMongoDB = database.model<ICommentDocument, ICommentMongoDB>(
  'Comment',
  commentSchema
)

export const CommentRepositoryImp = new CommentRepository(CommentMongoDB)

export default CommentMongoDB
