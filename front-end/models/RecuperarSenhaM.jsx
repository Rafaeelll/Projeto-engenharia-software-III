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
        .regex(/[0-9]/, 'número')  // Deve conter pelo menos um número
        .regex(/[a-zA-Z]/, 'letra') // Deve conter pelo menos uma letra
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'símbolo') // Deve conter pelo menos um símbolo
        .required()
        .messages({
            'string.min': 'A senha deve ter no mínimo 5 caracteres.',
            'string.max': 'A senha deve ter no máximo 10 caracteres.',
            'string.pattern.name': 'A senha deve conter pelo menos um {#name}.',
            '*': 'A senha é obrigatória e deve ter entre 5 e 10 caracteres.'
        }),
}).unknown(true); // Permite campos desconhecidos
export default MyAccount