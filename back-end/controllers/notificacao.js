const { Notificacao, Agenda, Usuario, Configuracao } = require('../models');
const cron = require('node-cron');
const { Op, where } = require('sequelize');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Cliente conectado ao servidor WebSocket.');

  ws.on('close', function close() {
    console.log('Cliente desconectado do servidor WebSocket.');
  });
});

function enviarNotificacaoWebSocket(notificacao) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notificacao));
    }
  });
}

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

controller.createAutomaticStartNotifications = async () => {
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
    const configUmaHoraAntes = await Configuracao.findOne({
      where:{
        config: {notificar_hora_antes_inicio: true}
      },
      include: ['usuario']
    })
    const configTrintaMinAntes = await Configuracao.findOne({
      where:{
        config: {notif_trinta_min_antes_inicio: true}
      },
      include: ['usuario']
    })
    const configNoInicio = await Configuracao.findOne({
      where:{
        config: {notif_no_inicio: true}
      },
      include: ['usuario']
    })

    const configIniAuto = await Configuracao.findOne({
      where:{
        config: {confirmar_auto_ini: true}
      },
      include: ['usuario']
    })

    // Notificar 1 hora antes da agenda começar (Padrão)
    if (configUmaHoraAntes) {

      for (const agenda of agendasPrestesComecar) {
        const umHoraAntesInicio = new Date(agenda.data_horario_inicio);
        umHoraAntesInicio.setHours(umHoraAntesInicio.getHours() - 1);

        const notificationExists = await Notificacao.findOne({
          where: {
            agenda_id: agenda.id,
            data_notificacao: umHoraAntesInicio
          }
        });

        if (!notificationExists) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configUmaHoraAntes.id,
            data_notificacao: umHoraAntesInicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora. Confirme sua presença clicando no ícone "Editar".`,
            confirmacao_presenca: false
          });
        }
        else if (!notificationExists && configIniAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configUmaHoraAntes.id,
            data_notificacao: umHoraAntesInicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora. Sua presença ja esta confirmada devido suas configuraçoes, caso deseja adiar a agenda clique no ícone "Editar".`,
            confirmacao_presenca: true
          });
          if (agenda.status !== 'Em andamento'){
            await Agenda.update({ status: 'Em andamento' }, { where: { id: agenda.id } });

          }
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
      }
    }

    // Notificar 30 minutos antes da agenda começar
    if (configTrintaMinAntes) {
      for (const agenda of agendasPrestesComecar) {
        const trintaMinAntesInicio = new Date(agenda.data_horario_inicio);
        trintaMinAntesInicio.setMinutes(trintaMinAntesInicio.getMinutes() - 30);

        const notificationExists = await Notificacao.findOne({
          where: {
            agenda_id: agenda.id,
            data_notificacao: trintaMinAntesInicio
          }
        });

        if (!notificationExists) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configTrintaMinAntes.id,
            data_notificacao: trintaMinAntesInicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 30 minutos. Confirme sua presença clicando no ícone "Editar".`,
            confirmacao_presenca: false
          });
          
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        else if (!notificationExists && configIniAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configUmaHoraAntes.id,
            data_notificacao: umHoraAntesInicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 30 minutos. Sua presença ja esta confirmada devido suas configuraçoes, caso deseja adiar a agenda clique no ícone "Editar".`,
            confirmacao_presenca: true
          });
          if (agenda.status !== 'Em andamento'){
            await Agenda.update({ status: 'Em andamento' }, { where: { id: agenda.id } });

          }
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        
      }
    }
    // Notificar somente quando a agenda começar
    if (configNoInicio) {
      for (const agenda of agendasInicializadas) {
        const notificationExists = await Notificacao.findOne({
          where: {
            agenda_id: agenda.id,
            data_notificacao: agenda.data_horario_inicio
          }
        });

        if (!notificationExists) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configNoInicio.id,
            data_notificacao: agenda.data_horario_inicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" ja começou. Confirme sua presença clicando no ícone "Editar".`,
            confirmacao_presenca: false
          });
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        else if (!notificationExists && configIniAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configUmaHoraAntes.id,
            data_notificacao: umHoraAntesInicio,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" ja começou. Sua presença já esta confirmada devido suas configuraçoes, caso deseja adiar a agenda clique no ícone "Editar".`,
            confirmacao_presenca: true
          });
          if (agenda.status !== 'Em andamento'){
            await Agenda.update({ status: 'Em andamento' }, { where: { id: agenda.id } });

          }
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

controller.createAutomaticFinishNotifications = async() =>{
  try{
    const agendasPrestesFin = await Agenda.findAll({
      where: {
        data_horario_fim: {[Op.gte]: new Date()  }   
    },
    include: ['usuario']
    })
    const agendaTerminadas = await Agenda.findAll({
      where: {
        data_horario_fim: { [Op.lte]: new Date() }
      },
      include: ['usuario']
    })
    const configUmaHoraAntesFin = await Configuracao.findOne({
      where:{
        config: {notificar_hora_antes_fim: true}
      },
      include: ['usuario']
    })
    const configTrintaMinAntesFin = await Configuracao.findOne({
      where:{
        config: {notif_trinta_min_antes_fim: true}
      },
      include: ['usuario']
    })
    const configNoFim = await Configuracao.findOne({
      where:{
        config: {notificar_no_fim: true}
      },
      include: ['usuario']
    })

    const configFinAuto = await Configuracao.findOne({
      where:{
        config: {confirmar_auto_fim: true}
      },
      include: ['usuario']
    })
    
    // Notificar sobre o fim da agenda assim que a agenda finalizar (Padrão)
    if (configNoFim) {
      for (const agenda of agendaTerminadas){
        const notificationEndExists = await Notificacao.findOne({
          where:{
            agenda_id: agenda.id,
            data_notificacao: agenda.data_horario_fim
          }
        });
  
        if (!notificationEndExists) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configNoFim.id,
            data_notificacao: agenda.data_horario_fim,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" já finalizou. Confirme a finalização clicando no ícone "Editar".`,
            confirmacao_finalizacao: false

          });
  
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de término de agenda',
            corpo: `Uma nova notificação de término de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        else if (!notificationEndExists && configFinAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configNoFim.id,
            data_notificacao: agenda.data_horario_fim,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" já finalizou. A finalização já esta confirmada devido as suas configurações.`,
            confirmacao_finalizacao: true
          });
          if (agenda.status !== 'Finalizada'){
            await Agenda.update({ status: 'Finalizada' }, { where: { id: agenda.id } });

          }
          const novaNotificacao = {
            titulo: 'Nova notificação de término de agenda',
            corpo: `Uma nova notificação de término de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);

        }
      }
    }
    // Notificar sobre o fim da agenda uma hora antes da agenda finalizar
    if (configUmaHoraAntesFin) {
      for (const agenda of agendasPrestesFin) {
        const umHoraAntesFim = new Date(agenda.data_horario_inicio);
        umHoraAntesFim.setHours(umHoraAntesFim.getHours() - 1);

        const notificationEndExists = await Notificacao.findOne({
          where:{
            agenda_id: agenda.id,
            data_notificacao: umHoraAntesFim
          }
        });
  
        if (!notificationEndExists){
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configUmaHoraAntesFin.id,
            data_notificacao: umHoraAntesFim,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" esta preste a finalizar em 1 hora. Confirme a finalização clicando no ícone "Editar".`,
            confirmacao_finalizacao: false
          });
  
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de término de agenda',
            corpo: `Uma nova notificação de término de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        else if (!notificationEndExists && configFinAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configNoFim.id,
            data_notificacao: agenda.data_horario_fim,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" esta preste a finalizar em 1 hora. A finalização já esta confirmada devido as suas configurações.`,
            confirmacao_finalizacao: true
          });
          if (agenda.status !== 'Finalizada'){
            await Agenda.update({ status: 'Finalizada' }, { where: { id: agenda.id } });

          }
          const novaNotificacao = {
            titulo: 'Nova notificação de término de agenda',
            corpo: `Uma nova notificação de término de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
      }
    }
     // Notificar 30 minutos antes da agenda começar
     if (configTrintaMinAntesFin) {
      for (const agenda of agendasPrestesFin) {
        const trintaMinAntesFin = new Date(agenda.data_horario_inicio);
        trintaMinAntesFin.setMinutes(trintaMinAntesFin.getMinutes() - 30);

        const notificationExists = await Notificacao.findOne({
          where: {
            agenda_id: agenda.id,
            data_notificacao: trintaMinAntesFin
          }
        });

        if (!notificationExists) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configTrintaMinAntesFin.id,
            data_notificacao: trintaMinAntesFin,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a finalizar em 30 minutos. Confirme sua presença clicando no ícone "Editar".`,
            confirmacao_finalizacao: false

          });
          
          // Envia a notificação via WebSocket
          const novaNotificacao = {
            titulo: 'Nova notificação de início de agenda',
            corpo: `Uma nova notificação de início de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }
        else if (!notificationExists && configFinAuto) {
          await Notificacao.create({
            agenda_id: agenda.id,
            usuario_id: agenda.usuario_id,
            config_id: configNoFim.id,
            data_notificacao: agenda.data_horario_fim,
            mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a finalizar em 30 minutos. A finalização já esta confirmada devido as suas configurações.`,
            confirmacao_finalizacao: true
          });
          if (agenda.status !== 'Finalizada'){
            await Agenda.update({ status: 'Finalizada' }, { where: { id: agenda.id } });

          }
          const novaNotificacao = {
            titulo: 'Nova notificação de término de agenda',
            corpo: `Uma nova notificação de término de agenda foi criada para ${agenda.usuario.nome}.`
            // Adicione outros campos conforme necessário
          };
          enviarNotificacaoWebSocket(novaNotificacao);
        }  
      }
    }
    
  } catch (error) {
    console.error(error)
  }
}

cron.schedule('*/1 * * * *', controller.createAutomaticStartNotifications);
cron.schedule('*/1 * * * *', controller.createAutomaticFinishNotifications);


// Método para recuperar o número total de notificações do usuário autenticado
controller.retrieveNotificationCount = async (req, res) => {
    try {
        const count = await Notificacao.count({
            where: { usuario_id: req.authUser.id } // Filtra apenas as notificações do usuário autenticado
        });
        console.log("Quantidade de notificações:", count);

        res.send({ count });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
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
controller.update = async (req, res) => {
  try {
    // Obtém o ID da notificação a ser atualizada
    const notificationId = req.params.id;

    // Obtém os novos dados da notificação a serem atualizados
    const newData = { ...req.body };
    delete newData.id; // Remove o campo "id" dos novos dados

    // Encontra a notificação a ser atualizada para obter o ID da agenda associada
    const notification = await Notificacao.findOne({
      where: { id: notificationId, usuario_id: req.authUser.id }
    });

    if (notification) {
      // Obtém o ID da agenda da notificação
      const agendaId = notification.agenda_id;

      // Verifica se a notificação confirma a finalização ou a inicialização
      if (newData.confirmacao_finalizacao === true) {
        // Se confirmar finalização, atualiza o status da agenda para 'Finalizada'
        await Agenda.update({ status: 'Finalizada' }, { where: { id: agendaId } });
      } else if (newData.confirmacao_presenca === true) {
        // Se confirmar inicialização, atualiza o status da agenda para 'Em andamento'
        await Agenda.update({ status: 'Em andamento' }, { where: { id: agendaId } });
      }

      // Atualiza todas as notificações com o mesmo ID de agenda
      await Notificacao.update(newData, { where: { agenda_id: agendaId } });

      // HTTP 204: No Content
      res.status(204).end();
    } else {
      // Não encontrou o registro para atualizar
      // HTTP 404: Not Found
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    // HTTP 500: Internal Server Error
    res.status(500).send('Erro interno do servidor.');
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

// Exporta o controlador
module.exports = controller;  
