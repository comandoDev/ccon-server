import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../core/Controller'
import { LikeModel } from '../../models/Like/LikeModel'
import { LikeRepositoryImp } from '../../models/Like/LikeMongoDB'
import ObjectId from '../../utils/ObjectId'
import { LikeRules } from './LikeRules'
import { LikeService } from './LikeService'

export const LikeServiceImp = new LikeService(
  LikeRepositoryImp
)

class LikeController extends Controller {
  protected rules = new LikeRules()

  handle (): Router {
    this.router.post('/posts/:postId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = request

        const { postId } = request.params

        this.rules.validate(
          { postId }
        )

        const likeModel = new LikeModel({
          postId: ObjectId(postId),
          userId: user._id!
        })

        const createdLike = await LikeServiceImp.create(likeModel)

        response.OK('Curtida cadastrada com sucesso!', {
          like: createdLike.object
        })
      } catch (error) {
        next(error)
      }
    })

    this.router.delete('/posts/:postId', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = request

        const { postId } = request.params

        this.rules.validate(
          { postId }
        )

        await LikeServiceImp.deleteByPostIdAndUserId(postId, user._id!)

        response.OK('Curtida removida com sucesso!')
      } catch (error) {
        next(error)
      }
    })

    return this.router
  }
}

const postController = new LikeController()
export default postController.handle()
