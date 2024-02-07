import mongoose from 'mongoose'

export default class Schema<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor (private _schema: mongoose.Schema<T>) { }

  get schema (): mongoose.Schema<T> {
    return this._schema
  }
}
