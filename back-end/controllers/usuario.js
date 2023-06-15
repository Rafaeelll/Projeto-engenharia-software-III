// Importar o model correspondente ao controller
const { Usuario } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const controller = {}   // Objeto vazio

/*
  Métodos CRUD do controller
  create: cria um novo registro
  retrieve: lista (recupera) todos os registros
  retrieveOne: lista (recupera) apenas um registro
  update: atualiza um registro
  delete: exclui um registro
*/

controller.create = async (req, res) => {
  try {

    // Criptografa a senha
    req.body.senha_acesso = await bcrypt.hash(req.body.senha_acesso , 12)

    await Usuario.create(req.body)
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
  }
}

controller.retrieve = async (req, res) => {
  try {
    const data = await Usuario.findAll()
    // HTTP 200: OK (implícito)
    res.send(data)
  }
  catch(error) {
    console.error(error)
  }
}

controller.retrieveOne = async (req, res) => {
  try {
    const data = await Usuario.findByPk(req.params.id)
    
    // HTTP 200: OK (implícito)
    if(data) res.send(data)
    
    // HTTP 404: Not Found
    else res.status(404).end()
    
  }
  catch(error) {
    console.error(error)
  }
}

controller.update = async (req, res) => {
  try {

    // Se houver sido passado o campo "senha_acesso",
    // criptografa a senha
    if(req.body.senha_acesso) {
      req.body.senha_acesso = await bcrypt.hash(req.body.senha_acesso, 12)
    }

    const response = await Usuario.update(
      req.body,
      { where: { id: req.params.id }}
    )

    // response retorna um vetor. O primeiro elemento
    // do vetor indica quantos registros foram afetados
    // pelo update
    if(response[0] > 0) {
      // HTTP 204: No content
      res.status(204).end()
    }
    else {  // Não encontrou o registro para atualizar
      // HTTP 404: Not found
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
  }
}

controller.delete = async (req, res) => {
  try {
    const response = await Usuario.destroy(
      { where: { id: req.params.id } }
    )

    if(response) {  // Encontrou e excluiu
      // HTTP 204: No content
      res.status(204).end()
    }
    else {          // Não encontrou e não excluiu
      // HTTP 404: Not found
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
  }
}

controller.login = async (req, res) => {
  try {
    const usuario = await Usuario.scope('withPassword').findOne({ where: { email: req.body.email } })

    // Usuário não encontrado ~> HTTP 401: Unauthorized
    if(!usuario) return res.status(401).end()

    const pwMatches = await bcrypt.compare(req.body.senha_acesso, usuario.senha_acesso)

    if(pwMatches) {
      // A senha confere
      const token = jwt.sign({
          id: usuario.id,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          telefone: usuario.telefone,
          data_nasc: usuario.data_nasc,
          plataforma_fav: usuario.plataforma_fav,
          jogo_fav: usuario.jogo_fav,
          foto_perfil: usuario.foto_perfil
        },
        process.env.TOKEN_SECRET,    // Chave para criptografar o token
        { expiresIn: '24h' }         // Duração do token
      )

        // Retorna o token ~> HTTP 200: OK (implícito)
      //res.json({ auth: true, token })
      
      res.cookie('AUTH', token, { 
        httpOnly: true, 
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 120 * 3600 // 24 horas, em segundos
      })
      res.json({auth: true})
      
    }
    else {
      // Senha errada ~> HTTP 401: Unauthorized
      res.status(401).end()
    }
  }
  catch(error) {
    console.error(error)
  }
}

controller.logout = (req, res) => {
  res.clearCookie('AUTH') // Apaga o cookie
  res.json({ auth: false })
}
controller.cadastro = async (req, res)=>{
  try {

    // Criptografa a senha
    req.body.senha_acesso = await bcrypt.hash(req.body.senha_acesso , 12)

    await Usuario.create(req.body)
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
  }

}

module.exports = controller