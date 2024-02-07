import { Types } from 'mongoose'

import Model from './Model'

export interface IUpdateDocumentProps {
  id: Types.ObjectId
  data: Model<any>
}

export abstract class Repository<MongoDB, Model> {
  constructor (protected mongoDB: MongoDB) {
    this.mongoDB = mongoDB
  }

  abstract findById(id: Types.ObjectId): Promise<Model | null>

  abstract create(data: Model): Promise<Model>

  abstract update(update: IUpdateDocumentProps): Promise<boolean>

  abstract delete (id: Types.ObjectId): Promise<boolean>
}
