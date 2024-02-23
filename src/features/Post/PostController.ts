import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../core/Controller'
import { adminMiddleware } from '../../middlewares/adminMiddleware'
import { hasPostPermission } from '../../middlewares/hasPostPermission'
import { PostModel } from '../../models/Post/PostModel'
import { PostRepositoryImp } from '../../models/Post/PostMongoDB'
import { PostRules } from './PostRules'
import { PostService } from './PostService'

export const PostServiceImp = new PostService(
  PostRepositoryImp
)

class PostController extends Controller {
  protected rules = new PostRules()

  handle (): Router {
    this.router.get('/', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const filters = PostModel.listFilters(request.query)

        const posts = await PostServiceImp.list(filters)

        response.OK('Publicações encontradas com sucesso!', {
          posts
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.get('/:postId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { postId } = request.params

        const post = await PostServiceImp.findById(postId)

        response.OK('Publicação encontrada com sucesso!', {
          post: post.show
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.post('/', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = request

        const {
          file,
          body
        } = request.body

        this.rules.validate(
          { file, isRequiredField: false },
          { body }
        )

        const postModel = new PostModel({
          body,
          file,
          userId: user._id!
        })

        const createdPost = await PostServiceImp.create(postModel)

        response.CREATED('Publicação cadastrada com sucesso!', {
          createdPost: createdPost.object
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.patch(
      '/:postId',
      hasPostPermission,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const { postId } = request.params

          const {
            file,
            body
          } = request.body

          this.rules.validate(
            { postId },
            { file, isRequiredField: false },
            { body, isRequiredField: false }
          )

          const createdPost = await PostServiceImp.update(
            postId,
            {
              file,
              body
            }
          )

          response.CREATED('Publicação cadastrada com sucesso!', {
            createdPost
          })
        } catch (error) {
          next(error)
        }
      })

    this.router.delete(
      '/:postId',
      hasPostPermission,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const { postId } = request.params

          this.rules.validate(
            { postId }
          )

          await PostServiceImp.delete(postId)

          response.OK('Publicação removida com sucesso!')
        } catch (error) {
          next(error)
        }
      })

    this.router.get(
      '/:postId/pin',
      adminMiddleware,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const { postId } = request.params

          this.rules.validate(
            { postId }
          )

          const posts = await PostServiceImp.pin(postId)

          response.OK('Publicação fixada com sucesso!', {
            posts
          })
        } catch (error) {
          next(error)
        }
      })

    this.router.get(
      '/:postId/unpin',
      adminMiddleware,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const { postId } = request.params

          this.rules.validate(
            { postId }
          )

          const posts = await PostServiceImp.unpin(postId)

          response.OK('Publicação desfixada com sucesso!', {
            posts
          })
        } catch (error) {
          next(error)
        }
      })

    return this.router
  }
}

const postController = new PostController()
export default postController.handle()
