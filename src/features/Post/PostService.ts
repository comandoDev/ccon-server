import { CommentServiceImp, LikeServiceImp } from '../../features/Post/PostController'
import { CommentModel, ICommentCreationProps } from '../../models/Comment/CommentModel'
import { IPost, IPostListFilters, PostModel } from '../../models/Post/PostModel'
import { PostRepositoryImp } from '../../models/Post/PostMongoDB'
import CustomResponse from '../../utils/CustomResponse'
import ObjectId from '../../utils/ObjectId'

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
    return await this.postRepositoryImp.create(post)
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
