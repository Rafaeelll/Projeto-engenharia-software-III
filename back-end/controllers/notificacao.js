const { Notificacao, Agenda, Usuario, Configuracao } = require('../models');
const send = require('./pushNotification'); // Importa a função send

const cron = require('node-cron');
const { Op, where } = require('sequelize');

const WebPush = require('web-push');
require('dotenv').config();

const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY
const email = process.env.EMAIL_USER
// const host = process.env.APP_URL

WebPush.setVapidDetails(
  email,           // Use a variável de ambiente para o subject
  publicKey, 
  privateKey
)


const controller = {};

/*
    Métodos CRUD do controlador
    - create: Cria um novo registro de notificação
    - retrieve: Lista (recupera) todas as notificações do usuário autenticado
    - retrieveOne: Lista (recupera) uma notificação específica do usuário autenticado
    - update: Atualiza uma notificação específica do usuário autenticado
    - delete: Deleta uma notificação específica do usuário autenticado

    Este código define um controlador para operações CRUD (Create, Read, Update, Delete) em registros de notificação. 
    Cada método executa uma operação específica no banco de dados, lidando com a criação, recuperação, 
    atualização e exclusão de registros de notificação, com base no usuário autenticado. 
    Além disso, há também a implementação de tarefas agendadas usando o módulo cron para enviar notificações 
    quando as agendasPrestesComecar estão prestes a comerçarem, terminar ou já terminaram.
*/
  
  controller.createAutomaticStartNotifications = async (req, res) => {
    try {
      const agendasPrestesComecar = await Agenda.findAll({
        where: {
          data_horario_inicio: { [Op.gte]: new Date() }
        },
        include: ['usuario']
      });
  
      const agendasInicializadas = await Agenda.findAll({
        where: {
          data_horario_inicio: { [Op.lte]: new Date() }
        },
        include: ['usuario']
      });
      console.log(`Agendas inicializadas encontradas: ${agendasInicializadas.length}`);
  
      const configUmaHoraAntes = await Configuracao.findOne({
        where: {
          horario_notif_inicio: '1 Hora Antes (Padrão)'
        },
        include: ['usuario']
      });
  
      const configTrintaMinAntes = await Configuracao.findOne({
        where: {
          horario_notif_inicio: '30 minutos antes'
        },
        include: ['usuario']
      });
  
      const configNoInicio = await Configuracao.findOne({
        where: {
          horario_notif_inicio: 'No Início'
        },
        include: ['usuario']
      });
  
      const criarNotificacaoInicio = async (agenda, dataNotificacao, configId, mensagem, usuarioId) => {
        await Notificacao.create({
          agenda_id: agenda.id,
          usuario_id: agenda.usuario_id,
          config_id: configId,
          data_notificacao: dataNotificacao,
          mensagem: mensagem,
        });
        const result = await send({ usuarioId: usuarioId, message: mensagem });
        if (result.status !== 201) {
          console.error(`Falha ao enviar notificação: ${result.message}`);
        }
      };
  
      // Notificar 1 hora antes da agenda começar (Padrão)
      if (configUmaHoraAntes) {
        await Promise.all(agendasPrestesComecar.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const umHoraAntesInicio = new Date(agenda.data_horario_inicio);
            umHoraAntesInicio.setHours(umHoraAntesInicio.getHours() - 1);
  
            const notificationExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: umHoraAntesInicio
              }
            });
  
            if (!notificationExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora. Confirme sua presença clicando no ícone "Editar".`;
              await criarNotificacaoInicio(agenda, umHoraAntesInicio, configUmaHoraAntes.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
  
      // Notificar 30 minutos antes da agenda começar
      if (configTrintaMinAntes) {
        await Promise.all(agendasPrestesComecar.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const trintaMinAntesInicio = new Date(agenda.data_horario_inicio);
            trintaMinAntesInicio.setMinutes(trintaMinAntesInicio.getMinutes() - 30);
  
            const notificationExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: trintaMinAntesInicio
              }
            });
  
            if (!notificationExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 30 minutos. Confirme sua presença clicando no ícone "Editar".`;
              await criarNotificacaoInicio(agenda, trintaMinAntesInicio, configTrintaMinAntes.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
  
      // Notificar somente quando a agenda começar
      if (configNoInicio) {
        await Promise.all(agendasInicializadas.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const notificationExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: agenda.data_horario_inicio
              }
            });
  
            if (!notificationExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" já começou. Confirme sua presença clicando no ícone "Editar".`;
              await criarNotificacaoInicio(agenda, agenda.data_horario_inicio, configNoInicio.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
    } catch (error) {
      console.error(error);
      // HTTP 500: Internal Server Error
      res.status(500).send('Erro interno do servidor.');
    }
  }; 

  controller.createAutomaticFinishNotifications = async (req, res) => {
    try {
      const agendasPrestesFin = await Agenda.findAll({
        where: {
          data_horario_fim: { [Op.gte]: new Date() }
        },
        include: ['usuario']
      });
  
      const agendaTerminadas = await Agenda.findAll({
        where: {
          data_horario_fim: { [Op.lte]: new Date() }
        },
        include: ['usuario']
      });
  
      const configUmaHoraAntesFin = await Configuracao.findOne({
        where: {
          horario_notif_fim: '1 Hora Antes'
        },
        include: ['usuario']
      });
  
      const configTrintaMinAntesFin = await Configuracao.findOne({
        where: {
          horario_notif_fim: '30 minutos antes'
        },
        include: ['usuario']
      });
  
      const configNoFim = await Configuracao.findOne({
        where: {
          horario_notif_fim: 'No Fim (Padrão)'
        },
        include: ['usuario']
      });
    
      const criarNotificacaoFinalizacao = async (agenda, dataNotificacao, configId, mensagem, usuarioId) => {
        await Notificacao.create({
          agenda_id: agenda.id,
          usuario_id: agenda.usuario_id,
          config_id: configId,
          data_notificacao: dataNotificacao,
          mensagem: mensagem,
        });
        const result = await send({ usuarioId: usuarioId, message: mensagem }); // Passa o usuarioId como argumento
        if (result.status !== 201) {
          console.error(`Falha ao enviar notificação: ${result.message}`); // Loga se a notificação falhar
        }    
      };
  
      // Notificar sobre o fim da agenda assim que a agenda finalizar (Padrão)
      if (configNoFim) {
        await Promise.all(agendaTerminadas.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const notificationEndExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: agenda.data_horario_fim
              }
            });
  
            if (!notificationEndExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" já finalizou. Confirme a finalização clicando no ícone "Editar".`;
              await criarNotificacaoFinalizacao(agenda, agenda.data_horario_fim, configNoFim.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
  
      // Notificar sobre o fim da agenda uma hora antes da agenda finalizar
      if (configUmaHoraAntesFin) {
        await Promise.all(agendasPrestesFin.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const umHoraAntesFim = new Date(agenda.data_horario_fim);
            umHoraAntesFim.setHours(umHoraAntesFim.getHours() - 1);
  
            const notificationEndExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: umHoraAntesFim
              }
            });
  
            if (!notificationEndExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a finalizar em 1 hora. Confirme a finalização clicando no ícone "Editar".`;
              await criarNotificacaoFinalizacao(agenda, umHoraAntesFim, configUmaHoraAntesFin.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
  
      // Notificar 30 minutos antes da agenda finalizar
      if (configTrintaMinAntesFin) {
        await Promise.all(agendasPrestesFin.map(async (agenda) => {
          if (agenda.usuario) { // Verifica se o usuário existe
            const trintaMinAntesFim = new Date(agenda.data_horario_fim);
            trintaMinAntesFim.setMinutes(trintaMinAntesFim.getMinutes() - 30);
  
            const notificationEndExists = await Notificacao.findOne({
              where: {
                agenda_id: agenda.id,
                data_notificacao: trintaMinAntesFim
              }
            });
  
            if (!notificationEndExists) {
              const mensagem = `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a finalizar em 30 minutos. Confirme a finalização clicando no ícone "Editar".`;
              await criarNotificacaoFinalizacao(agenda, trintaMinAntesFim, configTrintaMinAntesFin.id, mensagem, agenda.usuario.id);
            }
          } else {
            console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
          }
        }));
      }
  
    } catch (error) {
      console.error(error);
      // HTTP 500: Internal Server Error
      res.status(500).send('Erro interno do servidor.');
    }
  };
  

  controller.createAutoPauseStartNotifications = async (req, res) => {
    try {
      const PausaInicializadas = await Agenda.findAll({
        where: {
          p_data_horario_inicio: { [Op.gte]: new Date() }
        },
        include: ['usuario']
      });
  
  
      await Promise.all(PausaInicializadas.map(async (agenda) => {
        if (agenda.usuario) { // Verifica se o usuário existe
          const notificationExists = await Notificacao.findOne({
            where: {
              agenda_id: agenda.id,
              data_notificacao: agenda.p_data_horario_inicio
            }
          });
  
          if (!notificationExists) {
            const mensagem = `Olá ${agenda.usuario.nome}, a pausa da sua agenda já iniciou!`;
            await Notificacao.create({
              agenda_id: agenda.id,
              usuario_id: agenda.usuario_id,
              config_id: agenda.usuario_id, // Pode ser necessário revisar isso
              data_notificacao: agenda.p_data_horario_inicio,
              mensagem: mensagem
            });
            await send({ usuarioId: agenda.usuario.id, message: mensagem });
          }
        } else {
          console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
        }
      }));
    } catch (error) {
      console.error(error);
      // HTTP 500: Internal Server Error (opcional: você pode retornar uma resposta ao cliente)
      res.status(500).send('Erro interno do servidor.');
    }
  };
  
  controller.createAutoPauseFinishNotifications = async (req, res) => {
    try {
      const PausaTerminadas = await Agenda.findAll({
        where: {
          p_data_horario_fim: { [Op.lte]: new Date() }
        },
        include: ['usuario']
      });
  
  
      await Promise.all(PausaTerminadas.map(async (agenda) => {
        if (agenda.usuario) { // Verifica se o usuário existe
          const notificationEndExists = await Notificacao.findOne({
            where: {
              agenda_id: agenda.id,
              data_notificacao: agenda.p_data_horario_fim
            }
          });
  
          if (!notificationEndExists) {
            const mensagem = `Olá ${agenda.usuario.nome}, a pausa da sua agenda já terminou!`; // Corrigido para refletir o término
            await Notificacao.create({
              agenda_id: agenda.id,
              usuario_id: agenda.usuario_id,
              config_id: agenda.usuario_id, // Pode ser necessário revisar isso
              data_notificacao: agenda.p_data_horario_fim,
              mensagem: mensagem
            });
            await send({ usuarioId: agenda.usuario.id, message: mensagem });
          }
        } else {
          console.warn(`Usuário não encontrado para a agenda: ${agenda.id}`);
        }
      }));
    } catch (error) {
      console.error(error);
      // HTTP 500: Internal Server Error (opcional: você pode retornar uma resposta ao cliente)
      res.status(500).send('Erro interno do servidor.');
    }
  };
  

cron.schedule('*/1 * * * *', controller.createAutomaticStartNotifications);
cron.schedule('*/1 * * * *', controller.createAutomaticFinishNotifications);
cron.schedule('*/1 * * * *', controller.createAutoPauseStartNotifications);
cron.schedule('*/1 * * * *', controller.createAutoPauseFinishNotifications);

controller.updateNotificationCount = async (req, res) => {
  try {
    // Conta o número de notificações do usuário autenticado
    let notificacoesCount = await Notificacao.count({
      where: { usuario_id: req.authUser.id } // Filtra apenas as notificações do usuário autenticado
    });

    // Se houver notificações, atualiza a contagem para zero
    if (notificacoesCount > 0) {
      notificacoesCount = 0;

      // Atualiza as notificações no banco de dados para marcar como lidas ou removê-las
      await Notificacao.update(
        { contagem: notificacoesCount }, // Atualiza o campo contagem (ou o campo que representa as notificações)
        { where: { usuario_id: req.authUser.id } } // Filtra pelo usuário autenticado
      );
    }

    res.status(200).send('Contagem de notificações atualizada com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar contagem de notificações.');
  }
};

// Método para recuperar todas as notificações do usuário autenticado
controller.retrieve = async (req, res) => {
  try {
      const data = await Notificacao.findAll({
          where: { usuario_id: req.authUser.id }, // Filtra apenas as notificações do usuário autenticado
          include: [
              { model: Agenda, as: 'agenda' },
              { model: Usuario, as: 'usuario' },
              { model: Configuracao, as: 'configuracao'}
          ]
      });

      if (data) res.send(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Erro interno do servidor.");
  }
};


// Método para recuperar o total de notificações do usuário
controller.retrieveNotificationCount = async (req, res) => {
  try {
    // Busca todas as notificações do usuário autenticado
    const data = await Notificacao.findAll({
      where: { usuario_id: req.authUser.id },
      include: [
        { model: Agenda, as: 'agenda' },
        { model: Usuario, as: 'usuario' },
        { model: Configuracao, as: 'configuracao' }
      ]
    });

    // Busca o valor do campo contagem da primeira notificação (já que todas devem ter o mesmo valor de contagem)
    const contagem = data.length > 0 ? data[0].contagem : 0;

    // Envia os dados das notificações e a contagem
    res.send({ data, contagem });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
};

// Método para recuperar uma notificação específica do usuário autenticado
controller.retrieveOne = async (req, res) => {
    try {
        const data = await Notificacao.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela notificação do usuário autenticado
            include: [
              { model: Agenda, as: 'agenda' },
              { model: Usuario, as: 'usuario' },
              { model: Configuracao, as: 'configuracao'}
            ]
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para atualizar uma notificação específica do usuário autenticado
controller.updateAgendaConfirmation = async (req, res) => {
  try {
      // Obter a agenda relacionada
      const agendaId = req.params.agenda_id; // Supondo que o ID da agenda seja passado como parâmetro
      const agenda = await Agenda.findByPk(agendaId, {
          include: [{ model: Notificacao, as: 'notificacoes' }]
      });

      if (!agenda) {
          return res.status(404).send('Agenda não encontrada.');
      }

      const notificacao = agenda.notificacoes[0]; // Supondo que há apenas uma notificação relacionada

      // Atualizar os campos de confirmação e status
      const now = new Date();

      if (notificacao.confirmacao_presenca !== undefined) {
          if (notificacao.confirmacao_presenca) {
              if (now < agenda.data_horario_inicio) {
                  await agenda.update({ status: 'Inicialização Confirmada' });
              } else {
                  await agenda.update({ status: 'Inicialização Pendente' });
              }
          } else {
              if (now > agenda.data_horario_inicio) {
                  await agenda.update({ status: 'Inicialização Pendente' });
              }
          }
      }

      if (notificacao.confirmacao_finalizacao !== undefined) {
          if (notificacao.confirmacao_finalizacao) {
              if (now < agenda.data_horario_fim) {
                  await agenda.update({ status: 'Finalização Confirmada' });
              } else {
                  await agenda.update({ status: 'Finalização Pendente' });
              }
          } else {
              if (now > agenda.data_horario_fim) {
                  await agenda.update({ status: 'Finalização Pendente' });
              }
          }
      }

      res.status(200).send('Campos de confirmação e status atualizados com sucesso.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao atualizar os campos de confirmação e status.');
  }
};


// Método para deletar uma notificação específica do usuário autenticado
controller.delete = async (req, res) => {
  try {
    const response = await Notificacao.destroy(
        { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela notificação do usuário autenticado
    );
    if (response) {
        // Encontrou e excluiu
        // HTTP 204: No Content
        res.status(204).end();
    } else {
        // Não encontrou e não excluiu
        // HTTP 404: Not Found
        res.status(404).end();
    }
    } catch (error) {
      console.error(error);
    }
};

controller.publicKey = async function (req, res) {
  try {
    // Tenta encontrar o usuário autenticado
    let result = await Usuario.findOne({ where: { id: req.authUser.id } });

    // Verifica se o usuário foi encontrado
    if (!result) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Se o campo pushSubscription estiver null, retorne uma resposta sem erro
    if (!result.pushSubscription) {
      return res.status(200).json({ publicKey: null });
    }

    // Caso contrário, retorne a chave pública
    const publicKey = result.pushSubscription;
    res.status(200).json({ publicKey });

  } catch (error) {
    // Log do erro e resposta com erro 500
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


controller.register = async function (req, res) {
  const { subscription } = req.body;
  const usuarioId = req.authUser.id // Supondo que o usuário já esteja autenticado

  try {
    // Atualizar o usuário com a assinatura push
    await Usuario.update(
      { pushSubscription: subscription },
      { where: { id: usuarioId } }
    );

    res.status(201).send({ message: 'Inscrição para WebPush registrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar inscrição:', error);
    res.status(500).send({ message: 'Erro ao registrar inscrição para WebPush' });
  }
};

// Exporta o controlador
module.exports = controller;  
