import { Types } from 'mongoose'

import Model from '../../core/Model'
import { IUser } from '../User/UserModel'

export interface ICommentCreationProps {
  userId: Types.ObjectId
  postId: string
  text: string
}

export interface IComment {
  _id?: Types.ObjectId
  user?: Partial<IUser>
  createdAt?: Date

  userId: Types.ObjectId
  postId: Types.ObjectId
  text: string
}

export class CommentModel extends Model<IComment> {
  private _user: IComment['user']
  private _userId: IComment['userId']
  private _postId: IComment['postId']
  private _text: IComment['text']

  constructor (comment: IComment) {
    super(comment)

    this._user = comment.user
    this._userId = comment.userId
    this._postId = comment.postId
    this._text = comment.text
  }

  get userId (): IComment['userId'] {
    return this._userId
  }

  get postId (): IComment['postId'] {
    return this._postId
  }

  get user (): IComment['user'] {
    return this._user
  }

  set user (user: IComment['user']) {
    this._user = user
  }

  get text (): IComment['text'] {
    return this._text
  }

  get object (): IComment {
    return {
      _id: this._id,
      userId: this._userId,
      postId: this._postId,
      text: this._text
    }
  }

  get show (): IComment {
    return {
      _id: this._id,
      user: this._user,
      userId: this._userId,
      postId: this._postId,
      text: this._text,
      createdAt: this.createdAt
    }
  }
}
