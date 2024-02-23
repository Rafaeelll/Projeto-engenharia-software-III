// Importar o model correspondente ao controller
const { Usuario } = require('../models') // Importa o modelo de usuário do sistema
const bcrypt = require('bcrypt') // Biblioteca para hash de senhas
const jwt = require('jsonwebtoken') // Biblioteca para geração e verificação de tokens de autenticação

const controller = {}   // Objeto vazio

/*
  Métodos CRUD do controller
  create: cria um novo registro
  retrieve: lista (recupera) todos os registros
  retrieveOne: lista (recupera) apenas um registro
  update: atualiza um registro
  delete: exclui um registro


  Este código define um controlador para operações CRUD relacionadas aos usuários, incluindo autenticação. 
  Ele lida com a criação, recuperação, atualização e exclusão de registros de usuários no banco de dados, 
  bem como a autenticação de usuários com JWT (JSON Web Tokens). Os métodos fornecidos incluem:

  create: Criar um novo registo e verifica se um e-mail já está em uso antes de criar um novo usuário (Este metodo é que utilizo no back-end para realizar testes).
  retrieve: Lista todos os registros de usuários (recuperação).
  retrieveOne: Lista apenas um registro de usuário com base em seu ID.
  update: Atualiza um registro de usuário existente.
  delete: Exclui um registro de usuário existente.
  login: Autentica um usuário com base em seu e-mail e senha.
  logout: Encerra a sessão de um usuário e limpa o cookie de autenticação.
  cadastro: Criar um novo registo e verifica se um e-mail já está em uso antes de criar um novo usuário (Este metodo é o que utilizo no front-end).
  Este controlador é utilizado para gerenciar todas as interações relacionadas aos usuários dentro do sistema, 
  desde a criação de novas contas até a autenticação e manipulação dos dados dos usuários.
*/

controller.create = async (req, res) => {
  const { nome, sobrenome, email, senha_acesso, telefone } = req.body;
  const user = await Usuario.findOne({ where: { email } });

   try {
    // Verificação do e-mail antes de criar o usuário
    if (user) {
      // Se encontrou o usuário com o email, retorna um erro de conflito
      return res.status(409).send('O e-mail informado já está em uso.');
    }
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha_acesso, 12);

    await Usuario.create({
      nome,
      sobrenome,
      email,
      senha_acesso: hashedPassword,
      telefone,
      image: req.file.filename

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
      where: { id: req.user.id }  // Filtra pelos dados do usuário autenticado
    });
    res.send(data);
  } catch (error) {
    console.error(error);
  }
};

controller.retrieveOne = async (req, res) => {
  try {
    const data = await Usuario.findOne({
      where: { id: req.params.id, id: req.user.id } // Filtra pelo ID e pelo usuário autenticado
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
      { where: { id: req.params.id, id: req.user.id } } // Filtra pelo ID e pelo usuário autenticado
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
      { where: { id: req.params.id, id: req.user.id } } // Filtra pelo ID e pelo usuário autenticado
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
          image: usuario.image,
        },
        process.env.TOKEN_SECRET,    // Chave para criptografar o token
        { expiresIn: '24h' }         // Duração do token
      )

      // Retorna o token ~> HTTP 200: OK (implícito)
      //res.json({ auth: true, token })
      
      //verificar se é o primeiro acesso
      if(usuario.primeiro_acesso){
        res.cookie('AUTH', token, { 
          httpOnly: true, 
          secure: true,
          sameSite: 'None',
          path: '/',
          maxAge: 120 * 3600 // 24 horas, em segundos
        })
        res.json({auth: true, primeiro_acesso: true})
      }else{
        res.cookie('AUTH', token, { 
          httpOnly: true, 
          secure: true,
          sameSite: 'None',
          path: '/',
          maxAge: 120 * 3600 // 24 horas, em segundos
        })
        res.json({auth: true, primeiro_acesso: false})
      }  
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
  const { nome, sobrenome, email, senha_acesso, telefone } = req.body;
  const user = await Usuario.findOne({ where: { email } });

   try {
    // Verificação do e-mail antes de criar o usuário
    if (user) {
      // Se encontrou o usuário com o email, retorna um erro de conflito
      return res.status(409).send('O e-mail informado já está em uso.');
    }
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha_acesso, 12);

    await Usuario.create({
      nome,
      sobrenome,
      email,
      senha_acesso: hashedPassword,
      telefone,
      image: req.file.filename

    });
    // HTTP 201: Created
    return res.status(201).json(Usuario); // HTTP 201: Created
  } catch (error) {
    console.error(error);
  }
}
module.exports = controller
