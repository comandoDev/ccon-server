import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

import database from '../../config/database'
import { PostRepository } from './PostRepository'
import PostSchema, { IPostDocument, IPostMongoDB } from './PostSchema'

const postSchema = PostSchema.schema

postSchema.plugin(aggregatePaginate)

const PostMongoDB = database.model<IPostDocument, IPostMongoDB>(
  'Post',
  postSchema
)

export const PostRepositoryImp = new PostRepository(PostMongoDB)

export default PostMongoDB
