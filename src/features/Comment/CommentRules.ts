import Rules from '../../core/Rules'
import is from '../../utils/is'

export class CommentRules extends Rules {
  constructor () {
    super()

    this.validator.addRule('postId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador de publicação inválido. informe um identificador válido!'
    })

    this.validator.addRule('commentId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador de comentário inválido. informe um identificador válido!'
    })

    this.validator.addRule('userId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador de usuário inválido. informe um identificador válido!'
    })

    this.validator.addRule('text', {
      validator: (value: string) => is.string(value),
      message: 'Comentário inválido. informe um comentário válido!'
    })
  }
}
