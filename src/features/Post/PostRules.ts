import Rules from '../../core/Rules'
import is from '../../utils/is'

export class PostRules extends Rules {
  constructor () {
    super()

    this.validator.addRule('file', {
      validator: (value: string) => is.string(value),
      message: 'Arquivo inválido. informe um arquivo válido!'
    })

    this.validator.addRule('body', {
      validator: (value: string) => is.string(value),
      message: 'Publicação inválida. informe uma publicação válida!'
    })

    this.validator.addRule('postId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador de publicação inválido. informe um identificador válido!'
    })
  }
}
