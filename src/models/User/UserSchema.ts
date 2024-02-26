import mongoose, { AggregatePaginateModel, Document } from 'mongoose'

import Schema from '../../core/Schema'
import Bcrypt from '../../libraries/Bcrypt'
import { Gender, IUser } from './UserModel'

export interface IUserDocument extends Document, Omit<IUser, '_id'> { }

export interface IUserMongoDB extends AggregatePaginateModel<IUser> { }

class UserSchema extends Schema<IUserDocument> {
  constructor () {
    const user = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        enum: Gender,
        required: false
      },
      departament: {
        type: String,
        require: true
      },
      active: {
        type: Boolean,
        default: true
      },
      admin: {
        type: Boolean,
        default: false
      },
      avatar: String,
      createdAt: {
        type: Date,
        default: Date.now()
      }
    })

    user.pre<IUserDocument>('save', async function (): Promise<void> {
      if (!this.password || !this.isModified('password')) return
      try {
        const hashedPassword = await Bcrypt.hash(this.password)
        this.password = hashedPassword
      } catch (err) {
        console.error(`Error hashing the password for the user ${this.name}`, err)
      }
    })

    super(user)
  }
}

export default new UserSchema()
