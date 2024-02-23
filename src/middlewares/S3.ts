import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

import { s3 } from '../config/s3'

export const S3Middleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const file = request.file

    if (!file) return next()

    const params = {
      Bucket: 'denunc',
      Key: `${randomUUID()}-${file.originalname}`,
      Body: file.buffer
    }

    await s3.upload(params).promise()

    const filePath = `${process.env.URL_AWS}${params.Key}`
    request.filePath = filePath

    next()
  } catch (error) {
    next(error)
  }
}
