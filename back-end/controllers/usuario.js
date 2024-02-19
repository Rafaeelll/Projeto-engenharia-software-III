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
  const {originalname: name, size, key, location: url = ""} = req.file;
  const email = req.body.email;
  const user = await Usuario.findOne({ where: { email } });

   try {
    // Verificação do e-mail antes de criar o usuário
    if (user) {
      // Se encontrou o usuário com o email, retorna um erro de conflito
      return res.status(409).send('O e-mail informado já está em uso.');
    }
    // Verificação do e-mail antes de criar o usuário
    await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email,
      senha_acesso: req.body.senha_acesso = await bcrypt.hash(req.body.senha_acesso, 12), // Criptografa a senha
      telefone: req.body.telefone,
      name,
      size,
      key,
      url
    });
    // HTTP 201: Created
    return res.status(201).json(Usuario); // HTTP 201: Created
  } catch (error) {
    console.error(error);
  }
}

controller.retrieve = async (req, res) => {
  try {
    const data = await Usuario.findAll({
      where: { id: req.user.id }  // Filtre pelos dados do usuário autenticado
    });
    res.send(data);
  } catch (error) {
    console.error(error);
  }
};

controller.retrieveOne = async (req, res) => {
  try {
    const data = await Usuario.findOne({
      where: { id: req.params.id, id: req.user.id } // Filtre pelo ID e pelo usuário autenticado
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
  }
};

controller.update = async (req, res) => {
  try {
    const response = await Usuario.update(
      req.body,
      { where: { id: req.params.id, id: req.user.id } } // Filtre pelo ID e pelo usuário autenticado
    );

    if (response[0] > 0) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
  }
};

controller.delete = async (req, res) => {
  try {
    const response = await Usuario.destroy(
      { where: { id: req.params.id, id: req.user.id } } // Filtre pelo ID e pelo usuário autenticado
    );

    if (response) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
  }
};


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
          name: usuario.name,
          size: usuario.size,
          key: usuario.key,
          url: usuario.url
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

// Método para verificar se o e-mail já existe no banco de dados
controller.cadastro = async (req, res) => {
  const {originalname: name, size, key, location: url = ""} = req.file;
  const email = req.body.email;
  const user = await Usuario.findOne({ where: { email } });

   try {
    // Verificação do e-mail antes de criar o usuário
    if (user) {
      // Se encontrou o usuário com o email, retorna um erro de conflito
      return res.status(409).send('O e-mail informado já está em uso.');
    }
    // Verificação do e-mail antes de criar o usuário
    await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email,
      senha_acesso: req.body.senha_acesso = await bcrypt.hash(req.body.senha_acesso, 12), // Criptografa a senha
      telefone: req.body.telefone,
      name,
      size,
      key,
      url
    });
    // HTTP 201: Created
    return res.status(201).json(Usuario); // HTTP 201: Created
  } catch (error) {
    console.error(error);
  }
}


module.exports = controller
