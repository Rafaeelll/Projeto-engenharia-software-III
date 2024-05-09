// Importar o model correspondente ao controller
const { Usuario, Configuracao } = require('../models') // Importa o modelo de usuário do sistema
const bcrypt = require('bcrypt') // Biblioteca para hash de senhas
const jwt = require('jsonwebtoken') // Biblioteca para geração e verificação de tokens de autenticação
const { Op } = require('sequelize');
const cron = require('node-cron');

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

    // Criar usuário
    const novoUsuario = await Usuario.create({
      nome,
      sobrenome,
      email,
      senha_acesso: hashedPassword,
      telefone,
      image: req.file.filename
    });

    // Criar configuração associada ao novo usuário
    await Configuracao.create({
      usuario_id: novoUsuario.id, // Atribuir o ID do novo usuário
      config:{
        confirmar_auto_ini: false, // Confirmar na notificação a inicialização da agenda automaticamente
        confirmar_auto_fim: false, // Confirmar na notificação a finalização da agenda automaticamente
        notificar_hora_antes_inicio: true, // Padrão: notificar 1 hora antes da inicialização
        notif_trinta_min_antes_inicio: false, 
        notif_no_inicio: false, 
        notificar_no_fim: true, // Padrão: notificar na hora exata finalização
        notificar_hora_antes_fim: false,
        notif_trinta_min_antes_fim: false, 
      }
    });

    // HTTP 201: Created
    return res.status(201).json(novoUsuario); // HTTP 201: Created
  } catch (error) {
    console.error(error);
    // Tratar erros aqui
  }
}

controller.retrieve = async (req, res) => {
  try {
    const data = await Usuario.findAll({
      include: [
        {model: Configuracao, as: 'configuracoes'}
      ],
      where: { id: req.authUser.id }  // Filtra pelos dados do usuário autenticado
      
    });
    res.send(data);
  } catch (error) {
    console.error(error);
  }
};

controller.retrieveOne = async (req, res) => {
  try {
    const data = await Usuario.findOne({
      where: { id: req.params.id, id: req.authUser.id } // Filtra pelo ID e pelo usuário autenticado
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

controller.updateUserProfile = async (req, res) => {
  try {
    const response = await Usuario.update({
      id: req.authUser.id,
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      telefone: req.body.telefone,
      data_nasc: req.body.data_nasc,
      plataforma_fav: req.body.plataforma_fav,
      jogo_fav: req.body.jogo_fav

    },
      // Condição para atualização
      { 
        where: { id: req.params.id, id: req.authUser.id }
      }
    );
    // Verifica se a atualização foi bem-sucedida e retorna a resposta apropriada
    if (response[0] > 0) {
        // HTTP 204: No Content
        res.status(204).end();
    } else {
        // HTTP 404: Not Found
        res.status(404).end();
    }
    } catch (error) {
      console.error(error);
    }
};

controller.updateUserAccountStatus = async (req, res) => {
  try {
    
    const user = await Usuario.findOne({ where: { id: req.authUser.id } });

    if (!user) {
      // Se o usuário não for encontrado, retorne uma resposta 404
      return res.status(404).end();
    }

    // Verifica o status atual da conta e realiza a atualização correspondente
    if (user.status === true) {
      // Atualiza para inativo
      const response1 = await Usuario.update(
        { status: false },
        { where: { id: req.params.id, id: req.authUser.id }}
      );
      // Verifica e retorna a resposta apropriada
      if (response1[0] > 0) {  
        // HTTP 204: No Content
        return res.status(204).end();
      } else {
        // HTTP 404: Not Found
        return res.status(404).end();
      }
    } else {
      // Atualiza para ativo
      const response2 = await Usuario.update(
        { status: true },
        { where: { id: req.params.id, id: req.authUser.id }}
      );
      // Verifica e retorna a resposta apropriada
      if (response2[0] > 0) {  
        // HTTP 204: No Content
        return res.status(204).end();
      } else {
        // HTTP 404: Not Found
        return res.status(404).end();
      }
    }
  } catch (error) {
    console.error(error);
  }
}


controller.logout2 = (req, res) => {
  res.clearCookie('AUTH') // Apaga o cookie
  res.json({ auth: false })
}

controller.updateMyAccount = async (req, res) => {
  try {
    const user = await Usuario.findOne({ where: { id: req.authUser.id } });
    const { email, senha_acesso } = req.body;

    // Verifica se o email informado é igual ao email do usuário logado
    if (email !== user.email) {
      // Verifica se o email informado já está cadastrado no banco
      const emailExists = await Usuario.findOne({ where: { email } });
      
      if (emailExists) {
        // Se o email já existir no banco e não pertencer ao usuário logado, retorna erro de conflito
        return res.status(409).send('O e-mail informado já está em uso.');
      }
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha_acesso, 12);

    const response = await Usuario.update({
      email,
      senha_acesso: hashedPassword,
    },
    // Condição para atualização
    { where: { id: req.params.id, id: req.authUser.id }}
    );

    // Verifica se a atualização foi bem-sucedida e retorna a resposta apropriada
    if (response[0] > 0) {
      // HTTP 204: No Content
      res.status(204).end();
    } else {
      // HTTP 404: Not Found
      res.status(404).end();
    }
  } catch (error){
    console.error(error);
  }
}


controller.updateUserImg = async (req, res) => {
  try {
    const response = await Usuario.update({
      image: req.file.filename,
    },

    {
      // Condição para atualização
      where:{ id: req.params.id, id: req.authUser.id }
    });
    
    // Verifica se a atualização foi bem-sucedida e retorna a resposta apropriada
    if (response[0] > 0) {
        // HTTP 204: No Content
        res.status(204).end();
    } else {
        // HTTP 404: Not Found
        res.status(404).end();
    }
    } catch (error) {
        console.error(error);
    }
}

controller.delete = async (req, res) => {
  try {
    const response = await Usuario.destroy(
      { where: { id: req.params.id, id: req.authUser.id } } // Filtra pelo ID e pelo usuário autenticado
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

      //contagem de acessos apos o usuário efetuar o login
      const contagem = usuario.contagem_acesso + 1

      // Aqui atualizamos a contagem de acesso no objeto do usuário
      usuario.contagem_acesso = contagem;

      // Agora salvamos a atualização no banco de dados
      await usuario.save();

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
          contagem_acesso: contagem,
          status: usuario.status
        },
        process.env.TOKEN_SECRET,    // Chave para criptografar o token
        { expiresIn: '24h' }         // Duração do token
      )

      // Retorna o token ~> HTTP 200: OK (implícito)
      //res.json({ auth: true, token })
      
      //verificar se é o primeiro acesso
        res.cookie('AUTH', token, { 
          httpOnly: true, 
          secure: true,
          sameSite: 'None',
          path: '/',
          maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas a partir de agora
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

controller.deleteInactiveUsers = async (req, res) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - 1); // Alterado para 1 minuto

    const inactiveUsers = await Usuario.findAll({
      where: {
        status: false,
        updatedAt: { [Op.lt]: cutoffDate }
      }
    });

    if (inactiveUsers && inactiveUsers.length > 0) { // Verifica se há usuários inativos
      await Promise.all(inactiveUsers.map(async (user) => {
        if (user && user.status === false) { // Verifica se o usuário existe e se está inativo
          await Usuario.destroy({ where: { id: user.id } });
        }
      }));
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir usuários inativos.');
  }
};


// Agendar a execução da função deleteInactiveUsers a cada minuto
cron.schedule('*/1 * * * *', controller.deleteInactiveUsers);


module.exports = controller
