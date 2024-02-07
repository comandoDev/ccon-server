import axios from 'axios'
import { Types } from 'mongoose'

export interface ISendMailData {
    subject: string
    html: string
    receiver: string
}

class MailServer {
  private instance = axios.create({
    baseURL: process.env.MAIL_API_URL
  })

  async sendMail (data: ISendMailData): Promise<void> {
    await this.instance.post<ISendMailData>('/emails', data)
  }

  async sendActiveUserMail (userId: Types.ObjectId, receiver: string): Promise<void> {
    await this.instance.post<ISendMailData>('/emails', {
      subject: 'Ative sua conta!',
      html: `<h1>Ative sua conta para conseguir usar o CCON: <a href=http://url:3000/userId=${userId}>CLICA AQUI</a></h1>`,
      receiver
    })
  }
}

export default new MailServer()
