import Joi, { required } from 'joi'

const Jogo = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({'*': 'O nome do jogo é obrigatorio entre (2 e 50 caracteres).'})
})
.options({allowUnknown: true})
export default Jogo