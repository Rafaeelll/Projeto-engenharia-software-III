import Joi, { required } from 'joi'

const Agenda = Joi.object({
    // jogo_id: Joi.number()
    //     .min(1)
    //     .required()
    //     .messages({'*': 'O id é obrigatorio ser igual ou maior que 1.'}),
    titulo_agenda: Joi.string()
        .min(2)
        .max(200)
        .required()
        .messages({'*': 'O titúlo é obrigatorio entre (2 e 200 caracteres).'}),
    plt_transm: Joi.string()
        .min(2)
        .max(100)
        .messages({'*': 'A plataforma é obrigatorio entre (2 e 100 caracteres).'}),
    descricao: Joi.string()
        .min(2)
        .max(1000)
        .required()
        .messages({'*': 'A descrição é obrigatorio entre (2 e 1000 caracteres).'})
})
.options({allowUnknown: true})
export default Agenda