import Joi, { required } from 'joi'

const Perfil = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({'*': 'O nome é obrigatorio entre (2 e 100 caracteres).'}),
    sobrenome: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({'*': 'O sobrenome é obrigatorio entre (2 e 100 caracteres).'}),
    telefone: Joi.string()
        .min(14)
        .max(20)
        .required()
        .messages({'*': 'O telefone é obrigatorio entre (14 e 20 caracteres).'}),
    plataforma_fav: Joi.string()
        .min(2)
        .max(50)
        .messages({'*': 'A plataforma favorita é obrigatorio entre (2 e 50 caracteres).'}),
    jogo_fav: Joi.string()
        .min(2)
        .max(50)
        .messages({'*': 'O jogo favorito é obrigatorio entre (2 e 50 caracteres).'}),
    
}).unknown(true); // Permite campos desconhecidos
export default Perfil