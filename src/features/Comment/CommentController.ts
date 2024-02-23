import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../core/Controller'
import { CommentModel } from '../../models/Comment/CommentModel'
import { CommentRepositoryImp } from '../../models/Comment/CommentMongoDB'
import ObjectId from '../../utils/ObjectId'
import { CommentRules } from './CommentRules'
import { CommentService } from './CommentService'

export const CommentServiceImp = new CommentService(
  CommentRepositoryImp
)

class CommentController extends Controller {
  protected rules = new CommentRules()

  handle (): Router {
    this.router.post('/posts/:postId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = request

        const { postId } = request.params

        const {
          text
        } = request.body

        this.rules.validate(
          { postId },
          { userId: user._id },
          { text }
        )

        const commentModel = new CommentModel({
          postId: ObjectId(postId),
          text,
          userId: user._id!
        })

        const createdComment = await CommentServiceImp.create(commentModel)

        response.OK('Comentário cadastrado com sucesso!', {
          createdComment: createdComment.show
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.delete('/:commentId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { commentId } = request.params

        this.rules.validate(
          { commentId }
        )

        await CommentServiceImp.deleteById(commentId)

        response.OK('Comentário removido com sucesso!')
      } catch (error) {
        next(error)
      }
    })

    return this.router
  }
}

const postController = new CommentController()
export default postController.handle()
