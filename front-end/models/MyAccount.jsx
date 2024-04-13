import Joi from 'joi'

const MyAccount = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .min(10)
        .max(200)
        .required()
        .messages({'*': 'O email é obrigatório e deve ser válido.'}),
    senha_acesso: Joi.string()
        .min(5)
        .max(10)
        .required()
        .messages({'*': 'A senha é obrigatória e deve ter entre 5 e 200 caracteres.'}),
    confirmar_senha: Joi.string()
        .valid(Joi.ref('senha_acesso'))
        .required()
        .messages({'*': 'A confirmação de senha deve ser igual à senha.'}),
    
}).unknown(true); // Permite campos desconhecidos
export default MyAccount