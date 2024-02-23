import { Types } from 'mongoose'

import Model from '../../core/Model'
import { IComment } from '../../models/Comment/CommentModel'
import ObjectId from '../../utils/ObjectId'
import { ILike } from '../Like/LikeModel'
import { IUser } from '../User/UserModel'

export interface IPostListFilters {
  limit: number
  page: number
  userId?: Types.ObjectId
  active?: boolean
  pinned?: boolean
  search?: string
}

export interface IPost {
  _id?: Types.ObjectId
  file?: string
  pinned?: boolean
  active?: boolean
  likes?: Array<ILike>
  comments?: Array<IComment>
  user?: Partial<IUser>
  createdAt?: Date

  body: string
  userId: Types.ObjectId
}

export class PostModel extends Model<IPost> {
  private _file?: IPost['file']
  private _pinned?: IPost['pinned']
  private _active?: IPost['active']
  private _likes?: IPost['likes']
  private _comments?: IPost['comments']
  private _user?: IPost['user']
  private _body: IPost['body']
  private _userId: IPost['userId']

  constructor (post: IPost) {
    super(post)

    this._file = post.file
    this._pinned = post.pinned
    this._active = post.active
    this._body = post.body
    this._userId = post.userId
    this._likes = post.likes
    this._comments = post.comments
    this._user = post.user
  }

  get userId (): IPost['userId'] {
    return this._userId
  }

  get likes (): IPost['likes'] {
    return this._likes
  }

  set likes (likes: IPost['likes']) {
    this._likes = likes
  }

  get comments (): IPost['comments'] {
    return this._comments
  }

  set comments (comments: IPost['comments']) {
    this._comments = comments
  }

  get user (): IPost['user'] {
    return this._user
  }

  set user (user: IPost['user']) {
    this._user = user
  }

  get object (): IPost {
    return {
      _id: this._id,
      file: this._file,
      pinned: this._pinned,
      active: this._active,
      body: this._body,
      userId: this._userId,
      comments: this._comments
    }
  }

  get show (): IPost {
    return {
      _id: this._id,
      file: this._file,
      pinned: this._pinned,
      active: this._active,
      body: this._body,
      userId: this._userId,
      likes: this._likes,
      comments: this._comments,
      user: this._user,
      createdAt: this.createdAt
    }
  }

  static listFilters (
    {
      limit,
      page,
      userId,
      search,
      pinned,
      active
    }: Partial<IPostListFilters>
  ): IPostListFilters {
    const filters = {
      limit: 10,
      page: 1
    } as IPostListFilters

    if (active) Object.assign(filters, { active: Boolean(active) })
    if (pinned) Object.assign(filters, { pinned: Boolean(pinned) })
    if (search) Object.assign(filters, { body: { $regex: new RegExp(`${search}`, 'i') } })
    if (userId) Object.assign(filters, { userId: ObjectId(userId) })
    if (limit) Object.assign(filters, { limit: Number(limit) })
    if (page) Object.assign(filters, { page: Number(page) })

    return filters
  }
}
