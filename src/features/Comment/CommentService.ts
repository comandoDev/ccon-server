import { Types } from 'mongoose'

import { CommentModel } from '../../models/Comment/CommentModel'
import { CommentRepositoryImp } from '../../models/Comment/CommentMongoDB'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'
import { PostServiceImp } from '../Post/PostController'
import { UserServiceImp } from '../User/UserController'

export class CommentService {
  constructor (
    private commentRepositoryImp: typeof CommentRepositoryImp
  ) {
    this.commentRepositoryImp = commentRepositoryImp
  }

  async findById (commentId: string): Promise<CommentModel> {
    const comment = await this.commentRepositoryImp.findById(ObjectId(commentId))

    if (!comment) {
      throw CustomResponse.NOT_FOUND('Comentário não cadastrado!', {
        commentId
      })
    }

    const user = await UserServiceImp.findById(comment.userId.toString())

    comment.user = user.show

    return comment
  }

  async findAllByPostId (postId: Types.ObjectId): Promise<Array<CommentModel>> {
    const comments = await this.commentRepositoryImp.findAllByPostId(postId)

    await Promise.all(
      comments.map(async (comment) => {
        const user = await UserRepositoryImp.findById(comment.userId)

        comment.user = user?.show
      })
    )

    return comments
  }

  async deleteByPostIdAndUserId (postId: string, userId: Types.ObjectId): Promise<void> {
    await PostServiceImp.findById(postId)

    const comment = await this.commentRepositoryImp.findByPostIdAndUserId(ObjectId(postId), userId)
    if (!comment) {
      throw CustomResponse.NOT_FOUND('Comentário não cadastrado!')
    }

    await this.commentRepositoryImp.delete(comment._id!)
  }

  async deleteById (commentId: string): Promise<void> {
    await this.findById(commentId)

    const comment = await this.commentRepositoryImp.delete(ObjectId(commentId))
    if (!comment) {
      throw CustomResponse.INTERNAL_SERVER_ERROR('Algo deu errado removendo o comentário!')
    }
  }

  async create (comment: CommentModel): Promise<CommentModel> {
    return await this.commentRepositoryImp.create(comment)
  }
}
