// Importar o model correspondente ao controller
const { Usuario, Configuracao } = require('../models') // Importa o modelo de usuário do sistema
const bcrypt = require('bcrypt') // Biblioteca para hash de senhas
const jwt = require('jsonwebtoken') // Biblioteca para geração e verificação de tokens de autenticação
const { Op } = require('sequelize');
const cron = require('node-cron');
const crypto = require('crypto')
const mailer = require('../modules/mailer')
require('dotenv').config(); // Carregar variáveis de ambiente
const path = require('path');

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
    if (user) {
      return res.status(409).send('O e-mail informado já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(senha_acesso, 12);

    const imagemPadraoPath = path.resolve(__dirname, "..", "tmp", "uploads", "defaultprofile.png");
    const imagemPadraoNome = path.basename(imagemPadraoPath);
    const imagePath = req.file ? req.file.filename : imagemPadraoNome;

    // Gerar um token de confirmação
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1); // Expira em 1 hora

    // Criar usuário
    const novoUsuario = await Usuario.create({
      nome,
      sobrenome,
      email,
      senha_acesso: hashedPassword,
      telefone,
      image: imagePath,
      confirmationToken,
      confirmationTokenExpires: tokenExpires
    });

    // Criar configuração associada ao novo usuário
    await Configuracao.create({
      usuario_id: novoUsuario.id,
      confirmar_auto_ini: false,
      confirmar_auto_fim: false,
      horario_notif_inicio: '1 Hora Antes (Padrão)',
      horario_notif_fim: 'No Fim (Padrão)',
    });

    // Enviar o e-mail de confirmação
    mailer.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      template: 'auth/confirmacao_cadastro',
      context: { token: confirmationToken, nome: nome},
    }, (error) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ error: 'Erro ao enviar o e-mail de confirmação.' });
      }
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao criar o usuário.');
  }
};


controller.confirmarCadastro = async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar se o token é válido e não expirado
    let user = await Usuario.findOne({ 
      where: { confirmationToken: token }
    });

    // Se o token estiver expirado ou for inválido
    if (!user || user.confirmationTokenExpires < new Date()) {
      if (user) {
        // Gerar um novo token de confirmação
        const newToken = crypto.randomBytes(20).toString('hex');
        const newTokenExpires = new Date();
        newTokenExpires.setHours(newTokenExpires.getHours() + 1); // Expira em 1 hora

        // Atualizar o token e a data de expiração no banco de dados
        user.confirmationToken = newToken;
        user.confirmationTokenExpires = newTokenExpires;

        await user.save();

        // Reenviar o e-mail de confirmação com o novo token
        mailer.sendMail({
          to: user.email,
          from: process.env.EMAIL_USER,
          template: 'auth/confirmacao_cadastro',
          context: { token: newToken, nome: user.nome },
        }, (error) => {
          if (error) {
            console.log(error);
            return res.status(400).send({ error: 'Erro ao enviar o e-mail de confirmação.' });
          }
        });

        return res.status(400).send({ 
          message: 'Token expirado. Um novo token foi enviado para o seu e-mail.'
        });
      }

      return res.status(400).send({ error: 'Token inválido ou expirado.' });
    }

    // Se o token for válido, confirmar o cadastro
    user.confirmationToken = null;
    user.confirmationTokenExpires = null;
    user.registerConfirmed = true; // Ativando a conta

    await user.save();

    return res.status(200).send('Cadastro confirmado com sucesso!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao confirmar o cadastro.');
  }
};

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
    const user = await Usuario.scope('withPassword').findOne({ where: { id: req.authUser.id } });

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
    const pwMatches = await bcrypt.compare(req.body.senhaAtual, user.senha_acesso)

    if (pwMatches) {
        // A senha antiga confere com a que o usuário digitou
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
    }
    // Senha antiga informada pelo usuário não confere ~> HTTP 401: Unauthorized
    else res.status(401).end()

  } catch (error){
    console.error(error);
  }
}


controller.updateUserImg = async (req, res) => {
  try {

    //Aqui você define o caminho completo da imagem padrão
    const imagemPadraoPath = path.resolve(__dirname, "..", "tmp", "uploads", "defaultprofile.png");
    // E aqui você extrai apenas o nome do arquivo
    const imagemPadraoNome = path.basename(imagemPadraoPath);    
    
    const imagePath = req.file ? req.file.filename : imagemPadraoNome;

    const response = await Usuario.update({
      image: imagePath,
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
    // Verifica se o erro é relacionado ao tamanho do arquivo
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('O arquivo enviado é muito grande. O tamanho máximo permitido é 5MB.');
    }
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

    // Verifica se o cadastro foi confirmado
    if (!usuario.registerConfirmed) {
      return res.status(430).send('Por favor, confirme seu cadastro antes de fazer login.');
    }

    const pwMatches = await bcrypt.compare(req.body.senha_acesso, usuario.senha_acesso)

    if(pwMatches) {
      // A senha confere

      //contagem de acessos apos o usuário efetuar o login
      const contagem = usuario.contagem_acesso + 1
      usuario.contagem_acesso = contagem; // Aqui atualizamos a contagem de acesso no objeto do usuário
      // Agora salvamos a atualização no banco de dados
      await usuario.save();

      if (usuario.contagem_acesso > 1){
        const primeiro_login = false
        usuario.firstLogin = primeiro_login // Aqui atualizamos o campo que confere se é o primeiro login do usuario
        // Agora salvamos a atualização no banco de dados
        await usuario.save();
      }

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
    cutoffDate.setMinutes(cutoffDate.getMinutes() - 30);

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


// Agendar a execução da função deleteInactiveUsers a cada 30 dias
cron.schedule('0 0 */30 * *', controller.deleteInactiveUsers);

controller.esqueciSenha = async (req, res) => {
  try{
    const user = await Usuario.findOne({ where: {email: req.body.email}})

    if(!user) return res.status(401).end()

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await Usuario.update({
        passwordResetToken: token,
        passwordResetExpires: now,
      }, {
        where: { id: user.id }
      });

      mailer.sendMail({
        to: req.body.email,
        from: process.env.EMAIL_USER,
        template: 'auth/esqueci_senha',
        context: {token},
      }, (error) => {
        if (error) {
          console.log(error)
          return res.status(400).send({error: 'Erro ao enviar o email'})
        }
        return res.send();
      })

    }
  catch (error){
    console.log(error)
  }
}
controller.recuperSenha = async (req, res) => {
  const {email, token, senha_acesso} = req.body

  try {
    const user = await Usuario.scope('withResetTokenPassword').findOne({ where: {email}})

    if (!user) return res.status(401).end()

    if (token !== user.passwordResetToken) return res.status(400).send({error: 'Token inválido'})

    const now = new Date()

    if (now > user.passwordResetExpires) return res.status(400).send({error: 'Token expirado, gere um novo'})

    const hashedPassword = await bcrypt.hash(senha_acesso, 12);

    user.senha_acesso = hashedPassword
    
    await user.save();

    res.send();
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = controller
