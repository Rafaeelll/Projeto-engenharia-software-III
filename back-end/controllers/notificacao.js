// Importa os modelos necessários para o controlador
const { Notificacao, Agenda, Usuario } = require('../models');
// Importa o módulo cron para agendar tarefas
const cron = require('node-cron');
// Importa o operador de Sequelize
const { Op } = require('sequelize');

// Objeto controlador para os métodos CRUD e tarefas agendadas
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
    quando as agendas estão prestes a comerçarem, terminar ou já terminaram.
*/

// Método para criar uma nova notificação
controller.create = async (req, res) => {
    try {
        await Notificacao.create(req.body);
        // HTTP 201: Created
        res.status(201).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar todas as notificações do usuário autenticado
controller.retrieve = async (req, res) => {
    try {
        const data = await Notificacao.findAll({
            where: { usuario_id: req.authUser.id }, // Filtra apenas as notificações do usuário autenticado
            include: [
                { model: Agenda, as: 'agenda' },
                { model: Usuario, as: 'usuario' }
            ]
        });
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar uma notificação específica do usuário autenticado
controller.retrieveOne = async (req, res) => {
    try {
        const data = await Notificacao.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id } // Filtra pela notificação do usuário autenticado
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para atualizar uma notificação específica do usuário autenticado
controller.update = async (req, res) => {
    try {
        const response = await Notificacao.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela notificação do usuário autenticado
        );
        if (response[0] > 0) {
            // HTTP 204: No Content
            res.status(204).end();
        } else {
            // Não encontrou o registro para atualizar
            // HTTP 404: Not Found
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
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

// Função para verificar agendas prestes a começar e criar notificações
controller.scheduleAlertStartNotifications = async () => {
    try {
      const agendas = await Agenda.findAll({
        where: {
          data_horario_inicio: {
            [Op.gte]: new Date(), // A partir do horário atual
          }
        }
      });
  
      for (const agenda of agendas) {
        const timeDifference = agenda.data_horario_inicio.getTime() - new Date().getTime();
        const oneHourInMillis = 60 * 60 * 1000;
        const oneMinuteInMillis = 60 * 1000;
  
        if (timeDifference >= oneHourInMillis || timeDifference > 0) {
          const existingNotification = await Notificacao.findOne({
            where: { agenda_id: agenda.id }
          });
  
          if (!existingNotification) {
            const usuario = await Usuario.findByPk(agenda.usuario_id);
            let mensagem = '';
  
            if (timeDifference == oneHourInMillis) {
              mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora.`;
            } else {
              const minutosFaltantes = Math.floor(timeDifference / oneMinuteInMillis);
              mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em ${minutosFaltantes} minutos.`;
            }
            console.log(mensagem);
  
            try {
              await Notificacao.create({
                agenda_id: agenda.id,
                usuario_id: agenda.usuario_id,
                data_notificacao: new Date(),
                mensagem: mensagem,
                confirmacao_presenca: false
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Configurar o agendamento para rodar a cada X minutos (por exemplo, a cada 10 minutos)
  cron.schedule('*/10 * * * *', controller.scheduleAlertStartNotifications);
  

// Função para verificar agendas próximas ao fim e criar notificações
controller.scheduleAlertFinishNotifications = async () => {
    try {
        const agendas = await Agenda.findAll({
            where: {
                data_horario_fim: {
                    [Op.gte]: new Date(), // A partir do horário atual
                }
            }
        });

        for (const agenda of agendas) {
            const timeDifference = agenda.data_horario_fim.getTime() - new Date().getTime();
            const oneMinuteInMillis = 60 * 1000;

            // Defina o intervalo de minutos desejado para enviar a notificação
            const intervaloMinutos = 15;

            if (timeDifference <= intervaloMinutos * oneMinuteInMillis && timeDifference > 0) {
                // Lógica para criar a notificação
            } else if (timeDifference <= 0) {
                // Lógica para criar a notificação quando a agenda acabar
            }
        }
    } catch (error) {
        console.error(error);
    }
};

// Configurar o agendamento para rodar a cada X minutos
cron.schedule('*/10 * * * *', controller.scheduleAlertFinishNotifications);

// Exporta o controlador
module.exports = controller;  
