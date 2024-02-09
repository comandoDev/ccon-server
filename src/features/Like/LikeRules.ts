import Rules from '../../core/Rules'
import is from '../../utils/is'

export class LikeRules extends Rules {
  constructor () {
    super()

    this.validator.addRule('postId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador de publicação inválido. informe um identificador válido!'
    })
  }
}
