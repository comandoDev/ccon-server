import { Types } from 'mongoose'

import Model from '../../core/Model'

export interface IUserAuthenticatedProps {
  token: string
  user: IUser
}

export interface IUserTokenPayload {
  userId?: Types.ObjectId
  admin?: boolean
  avatar?: string
  name: string
  email: string
  departament: string
}

export enum Gender {
  man = 'man',
  woman = 'woman'
}

export const GenderValues = Object.values(Gender)

export interface IUser {
  _id?: Types.ObjectId
  active?: boolean
  admin?: boolean
  avatar?: string
  gender?: Gender
  createdAt?: Date

  name: string
  email: string
  password: string
  departament: string
}

export class UserModel extends Model<IUser> {
  private _active?: IUser['active']
  private _admin?: IUser['admin']
  private _avatar?: IUser['avatar']
  private _gender?: IUser['gender']
  private _name: IUser['name']
  private _email: IUser['email']
  private _password: IUser['password']
  private _departament: IUser['departament']

  constructor (user: IUser) {
    super(user)

    this._id = user._id
    this._active = user.active
    this._admin = user.admin
    this._avatar = user.avatar
    this._gender = user.gender
    this._name = user.name
    this._email = user.email
    this._password = user.password
    this._departament = user.departament
    this.createdAt = user.createdAt
  }

  get active (): IUser['active'] {
    return this._active
  }

  get object (): IUser {
    return {
      _id: this._id,
      active: this._active,
      admin: this._admin,
      avatar: this._avatar,
      gender: this._gender,
      name: this._name,
      email: this._email,
      password: this._password,
      departament: this._departament,
      createdAt: this.createdAt
    }
  }

  get show () {
    return this.object
  }
}
