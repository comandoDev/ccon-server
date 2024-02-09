import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

import database from '../../config/database'
import { LikeRepository } from './LikeRepository'
import LikeSchema, { ILikeDocument, ILikeMongoDB } from './LikeSchema'

const likeSchema = LikeSchema.schema

likeSchema.plugin(aggregatePaginate)

const LikeMongoDB = database.model<ILikeDocument, ILikeMongoDB>(
  'Like',
  likeSchema
)

export const LikeRepositoryImp = new LikeRepository(LikeMongoDB)

export default LikeMongoDB
