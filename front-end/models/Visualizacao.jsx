import Joi, { required } from 'joi'

const Views = Joi.object({
    usuario_id: Joi.number()
        .min(1)
        .required()
        .messages({'*': 'O id é obrigatorio ser igual ou maior que 1.'}),
    agenda_id: Joi.number()
        .min(1)
        .required()
        .messages({'*': 'O id é obrigatorio ser igual ou maior que 1.'}),
    numero_visualizacao: Joi.number()
        .min(0)
        .required()
        .messages({'*': 'O número de visualizações é obrigatorio ser igual ou maior que 0.'})
})
.options({allowUnknown: true})
export default Views