import Joi, { required } from 'joi'

const HistoricoJogo = Joi.object({
    jogo_id: Joi.number()
        .min(1)
        .required()
        .messages({'*': 'O id é obrigatorio ser igual ou maior que 1.'}),
    nivel: Joi.number()
        .min(1)
        .required()
        .messages({'*': 'A pontuação é obrigatorio ser igual ou maior que 1.'})
})
.options({allowUnknown: true})
export default HistoricoJogo