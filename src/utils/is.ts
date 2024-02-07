import mongoose from 'mongoose'

const is = {
  string: (value: any) => typeof value === 'string',
  number: (value: any) => typeof value === 'number',
  array: (value: any) => Array.isArray(value),
  boolean: (value: any): boolean => ['true', true, 'false', false].includes(value),
  ID: (value: any): boolean => is.string(value) && value.length === 36,
  object: (value: any): boolean => typeof value === 'object' && value !== null,
  email: (value: any): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  objectId: (value: any): boolean => mongoose.Types.ObjectId.isValid(value)
}

export default is
