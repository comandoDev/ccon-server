import { Types } from 'mongoose'

import { PostServiceImp } from '../../features/Post/PostController'
import { UserServiceImp } from '../../features/User/UserController'
import { LikeModel } from '../../models/Like/LikeModel'
import { LikeRepositoryImp } from '../../models/Like/LikeMongoDB'
import { PostModel } from '../../models/Post/PostModel'
import { UserRepositoryImp } from '../../models/User/UserMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'

export class LikeService {
  constructor (
    private likeRepositoryImp: typeof LikeRepositoryImp
  ) {
    this.likeRepositoryImp = likeRepositoryImp
  }

  async findById (likeId: Types.ObjectId): Promise<LikeModel> {
    const like = await this.likeRepositoryImp.findById(ObjectId(likeId))

    if (!like) {
      throw CustomResponse.NOT_FOUND('Curtida não cadastrada!', {
        likeId
      })
    }

    const user = await UserServiceImp.findById(like.userId.toString())

    like.user = user.show

    return like
  }

  async findAllByPostId (postId: Types.ObjectId): Promise<Array<LikeModel>> {
    const likes = await this.likeRepositoryImp.findAllByPostId(postId)

    await Promise.all(
      likes.map(async (like) => {
        const user = await UserRepositoryImp.findById(like.userId)

        like.user = user?.show
      })
    )

    return likes
  }

  async create (like: LikeModel): Promise<LikeModel> {
    const post = await this.findPostById(like.postId.toString())

    const exists = await this.existsByPostIdAndUserId(post._id!, like.userId)
    if (exists) throw CustomResponse.CONFLICT('Curtida já cadastrada!')

    return await this.likeRepositoryImp.create(like)
  }

  async deleteByPostIdAndUserId (postId: string, userId: Types.ObjectId): Promise<void> {
    await this.findPostById(postId)

    const like = await this.likeRepositoryImp.findByPostIdAndUserId(ObjectId(postId), userId)
    if (!like) {
      throw CustomResponse.NOT_FOUND('Curtida não cadastrada!')
    }

    await this.likeRepositoryImp.delete(like._id!)
  }

  private async existsByPostIdAndUserId (postId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const like = await this.likeRepositoryImp.findByPostIdAndUserId(postId, userId)

    return !!like
  }

  private async findPostById (postId: string): Promise<PostModel> {
    return await PostServiceImp.findById(postId)
  }
}
