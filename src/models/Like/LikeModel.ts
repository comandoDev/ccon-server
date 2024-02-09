import { Types } from 'mongoose'

import Model from '../../core/Model'
import { IUser } from '../User/UserModel'

export interface ILike {
  _id?: Types.ObjectId
  user?: Partial<IUser>
  createdAt?: Date

  userId: Types.ObjectId
  postId: Types.ObjectId
}

export class LikeModel extends Model<ILike> {
  private _user: ILike['user']
  private _userId: ILike['userId']
  private _postId: ILike['postId']

  constructor (like: ILike) {
    super(like)

    this._user = like.user
    this._userId = like.userId
    this._postId = like.postId
  }

  get userId (): ILike['userId'] {
    return this._userId
  }

  get postId (): ILike['postId'] {
    return this._postId
  }

  get user (): ILike['user'] {
    return this._user
  }

  set user (user: ILike['user']) {
    this._user = user
  }

  get object (): ILike {
    return {
      _id: this._id,
      userId: this._userId,
      postId: this._postId
    }
  }

  get show (): ILike {
    return {
      _id: this._id,
      user: this._user,
      userId: this._userId,
      postId: this._postId,
      createdAt: this.createdAt
    }
  }
}
