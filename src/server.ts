/* eslint-disable no-useless-constructor */

import cors from 'cors'
import express, { Application } from 'express'
import morgan from 'morgan'

import database from './config/database'
import env from './config/env'
import router from './routes/router'

export class Server {
  constructor (
    private _app: Application,
    private port: number = env.port
  ) { }

  async init (): Promise<void> {
    this.setupApp()
    this.setupRoutes()
  }

  private setupRoutes (): void {
    this._app.use(router)
  }

  private setupApp (): void {
    this._app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
    this._app.use(cors({ }))
    this._app.use(express.json())
  }

  async close (): Promise<void> {
    database.close()
  }

  get app (): Application {
    return this._app
  }

  start (): void {
    this._app.listen(this.port, '10.0.12.166', () => {
      console.log(`Server running at: ${this.port}`)
    })
  }
}
