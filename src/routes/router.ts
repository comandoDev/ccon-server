import { Router } from 'express'

import { customResponseMiddleware } from '../middlewares/customReponse'
import { errorMiddleware } from '../middlewares/error'
import AuthRouter from './auth'
import UnauthRouter from './unauth'

const router = Router()

router.use((req, res, next) => {
  customResponseMiddleware(res)
  next()
})

router.use('/unauth', UnauthRouter)
router.use('/auth', AuthRouter)

router.use(errorMiddleware)

export default router
