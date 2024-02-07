import dotenv from 'dotenv'

dotenv.config()

export default {
  ip: process.env.IP!,
  port: Number(process.env.PORT!),
  secretJwt: process.env.SECRECT_JWT!,
  mongoUrl: process.env.MONGO_URL!
}
