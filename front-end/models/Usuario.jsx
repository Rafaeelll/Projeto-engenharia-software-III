import Joi from 'joi';

const Usuario = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({'*': 'O nome é obrigatório entre (2 e 100 caracteres).'}),
    sobrenome: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({'*': 'O sobrenome é obrigatório entre (2 e 100 caracteres).'}),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .min(10)
        .max(200)
        .required()
        .messages({'*': 'O email é obrigatório e deve ser válido.'}),
    senha_acesso: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({'*': 'A senha é obrigatória e deve ter entre 5 e 200 caracteres.'}),
    confirmar_senha: Joi.string()
        .valid(Joi.ref('senha_acesso'))
        .required()
        .messages({'*': 'A confirmação de senha deve ser igual à senha.'}),
    telefone: Joi.string()
        .min(14)
        .max(20)
        .required()
        .messages({'*': 'O telefone é obrigatório entre (14 e 20 caracteres).'}),
});

export default Usuario;
