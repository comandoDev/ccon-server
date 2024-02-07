import { Types } from 'mongoose'

import Model from './Model'

export interface IUpdateDocumentProps {
  id: Types.ObjectId
  data: Model<any>
  tenantId: Types.ObjectId
}

export abstract class Repository<MongoDB, Model> {
  constructor (protected mongoDB: MongoDB) {
    this.mongoDB = mongoDB
  }

  abstract findById(id: Types.ObjectId, tenantId: Types.ObjectId): Promise<Model | null>

  abstract create(data: Model, tenantId: Types.ObjectId): Promise<Model>

  abstract update(update: IUpdateDocumentProps): Promise<boolean>

  abstract delete (id: Types.ObjectId, tenantId: Types.ObjectId): Promise<boolean>
}
