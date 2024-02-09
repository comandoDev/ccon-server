import { Types } from 'mongoose'

import { CommentModel } from '../../models/Comment/CommentModel'
import { CommentRepositoryImp } from '../../models/Comment/CommentMongoDB'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'
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
      throw CustomResponse.NOT_FOUND('Curtida não cadastrada!', {
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

  async create (comment: CommentModel): Promise<CommentModel> {
    return await this.commentRepositoryImp.create(comment)
  }
}
