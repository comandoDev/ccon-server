import { UserServiceImp } from '../../features/User/UserController'
import { CommentModel, ICommentCreationProps } from '../../models/Comment/CommentModel'
import { IPost, IPostListFilters, PostModel } from '../../models/Post/PostModel'
import { PostRepositoryImp } from '../../models/Post/PostMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'
import { CommentServiceImp } from '../Comment/CommentController'
import { LikeServiceImp } from '../Like/LikeController'

export class PostService {
  constructor (
    private postRepositoryImp: typeof PostRepositoryImp
  ) {
    this.postRepositoryImp = postRepositoryImp
  }

  async findById (postId: string): Promise<PostModel> {
    const post = await this.postRepositoryImp.findById(ObjectId(postId))

    if (!post) {
      throw CustomResponse.NOT_FOUND('Publicação não cadastrada!', {
        postId
      })
    }

    const likes = await LikeServiceImp.findAllByPostId(ObjectId(postId))
    post.likes = likes.map(like => like.show)

    const comments = await CommentServiceImp.findAllByPostId(ObjectId(postId))
    post.comments = comments.map(comment => comment.show)

    const user = await UserServiceImp.findById(post.userId.toString())
    post.user = user.show

    return post
  }

  async update (
    postId: string,
    properties: Partial<IPost>
  ): Promise<void> {
    const updated = await this.postRepositoryImp.modifyProperties(
      ObjectId(postId),
      properties
    )

    if (!updated) {
      throw CustomResponse.INTERNAL_SERVER_ERROR('Não foi possível atualizar publicação!', {
        postId
      })
    }
  }

  async create (post: PostModel): Promise<PostModel> {
    const isAdmin = await UserServiceImp.isAdmin(post.userId)

    const createdPost = await this.postRepositoryImp.create(post)

    // if (isAdmin) {
    //   const users = await UserServiceImp.findAll()

    //   Promise.all(users.map(async (user) => {
    //     await MailServer.sendNewAdminPostMail(user.object.email)
    //   }))
    // }

    return createdPost
  }

  async list (filters: IPostListFilters) {
    const list = await this.postRepositoryImp.list(filters)

    await Promise.all(
      list.docs.map(async (doc: IPost) => {
        const likes = await LikeServiceImp.findAllByPostId(doc._id!)
        doc.likes = likes.map(like => like.show)

        const comments = await CommentServiceImp.findAllByPostId(doc._id!)
        doc.comments = comments.map(comment => comment.show)
      })
    )

    return list
  }

  async delete (postId: string): Promise<void> {
    await this.update(
      postId,
      {
        active: false
      }
    )
  }

  async pin (postId: string): Promise<void> {
    await this.findById(postId)

    const pinnedPosts = await this.postRepositoryImp.findAllPinneds()

    if (pinnedPosts.length >= 5) {
      const firstPinned = pinnedPosts[0]

      await this.update(firstPinned._id!.toString(), {
        pinned: false
      })
    }

    await this.update(postId, {
      pinned: true
    })
  }

  async unpin (postId: string): Promise<void> {
    await this.findById(postId)

    await this.update(postId, {
      pinned: false
    })
  }

  async comment ({
    postId,
    text,
    userId
  }: ICommentCreationProps): Promise<void> {
    await this.findById(postId)

    const commentModel = new CommentModel({
      postId: ObjectId(postId),
      text,
      userId
    })

    await CommentServiceImp.create(commentModel)
  }
}
