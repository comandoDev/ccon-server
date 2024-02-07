import { Types } from 'mongoose'

export default abstract class Model<T> {
  public _id?: Types.ObjectId
  public tenantId: Types.ObjectId
  protected createdAt?: Date
  protected updatedAt?: Date

  abstract get object (): Record<string, any>

  constructor (model: T & {
    _id?: Types.ObjectId
    tenantId: Types.ObjectId
    createdAt?: Date,
    updatedAt?: Date
  }) {
    this._id = model._id
    this.tenantId = model.tenantId
    this.createdAt = model?.createdAt
    this.updatedAt = model?.updatedAt
  }
}
