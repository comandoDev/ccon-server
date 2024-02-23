import Rules from '../../core/Rules'
import { Gender, GenderValues } from '../../models/User/UserModel'
import is from '../../utils/is'
import { nameValidator } from '../../utils/nameValidator'

export class UserRules extends Rules {
  constructor () {
    super()

    this.validator.addRule('userId', {
      validator: (value: string) => is.objectId(value),
      message: 'Identificador do usuário inválido. informe um Id válido!'
    })

    this.validator.addRule('name', {
      validator: (value: string) => nameValidator(value),
      message: 'Nome inválido. Informe seu nome completo!'
    })

    this.validator.addRule('gender', {
      validator: (value: Gender) => GenderValues.includes(value),
      message: 'Gênero inválido. Informe um gênero válido!'
    })

    this.validator.addRule('email', {
      validator: (value: string) => is.string(value),
      message: 'Email inválido. Informe um email válido!'
    })

    this.validator.addRule('password', {
      validator: (value: string) => is.string(value),
      message: 'Senha inválida. Informe uma senha válida!'
    })

    this.validator.addRule('passwordsMatch', {
      validator: (value: Array<string>) => value[0] === value[1],
      message: 'As senhas informadas não coincidem!'
    })

    this.validator.addRule('departament', {
      validator: (value: string) => is.string(value),
      message: 'Departamento inválido. Informe um departamento válido!'
    })

    this.validator.addRule('avatar', {
      validator: (value: string) => is.string(value),
      message: 'Imagem de perfil inválida. Informe uma imagem válida!'
    })
  }
}
