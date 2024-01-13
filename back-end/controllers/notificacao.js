// importar o model correspondente ao controller
const {Notificacao, Agenda, Usuario} = require('../models')
const cron = require('node-cron');
const { Op } = require('sequelize');

const controller = {} // objeto vazio

/*
    metodos CRUD do controller
    create: Cria um novo registro
    retrieve: lista (recupera) todos os registros
    retrieveOne: Lista (recupera) um registro
    uptade: atualiza um registro
    delete: deletar um registro
*/

controller.create = async (req, res) =>{
    try{
        await Notificacao.create(req.body)
        // HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieve = async (req, res)=>{
    try{
        const data = await Notificacao.findAll({
          where: { usuario_id: req.authUser.id }, // Filtra apenas as agendas do usuário autenticado
            include: [
                {model: Agenda, as: 'agenda'},
                {model: Usuario, as: 'usuario'}
            ]
        })
        res.send(data)

    }
    catch(error){
        console.error(error)
    }
}
controller.retrieveOne = async (req, res)=>{
    try{
        const data = await Notificacao.findOne({
          where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela agenda do usuário autenticado

        });    
        if(data) res.send(data)
        
        else res.status(404).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.update = async(req, res) =>{
    try{
        const response = await Notificacao.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
        )
        /// response retorna um vetor. O primeiro elemento
        // do vetor indica quantos registros foram afetados
        // pelo uptade
        if(response[0] > 0){
            // HTTP 204: No content
            res.status(204).end()
        }
        else{ // Não encontrou o registro para atualizar
            // HTTP 404: Not found
            res.status(404).end()
        }
    }
    catch(error){
        console.error(error)
    }
}
controller.delete = async (req, res) =>{
    try{
        const response = await Notificacao.destroy(
          { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
          )
        if(response){// encontrou e excluiu
            // HTTP 204: No content
            res.status(204).end()
        }
        else{ // Não encontrou e não excluiu
            // HTTP 404: Not found
            res.status(404).end()
        }
    }
    catch(error){
        console.error(error)
    }
}
// Nova função para verificar as agendas e criar notificações
// ...
// controller.scheduleAlertStartNotifications = async () => {
//   try {
//     const agendas = await Agenda.findAll({
//       where: {
//         data_horario_inicio: {
//           [Op.gte]: new Date(), // A partir do horário atual
//         }
//       }
//     });

//     for (const agenda of agendas) {
//       const timeDifference = agenda.data_horario_inicio.getTime() - new Date().getTime();
//       const oneHourInMillis = 60 * 60 * 1000;
//       const oneMinuteInMillis = 60 * 1000;

//       if (timeDifference >= oneHourInMillis || timeDifference > 0) {
//         const existingNotification = await Notificacao.findOne({
//           where: { agenda_id: agenda.id }
//         });

//         if (!existingNotification) {
//           const usuario = await Usuario.findByPk(agenda.usuario_id);
//           let mensagem = '';

//           if (timeDifference == oneHourInMillis) {
//             mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora.`;
//           } else {
//             const minutosFaltantes = Math.floor(timeDifference / oneMinuteInMillis);
//             mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em ${minutosFaltantes} minutos.`;
//           }
//           console.log(mensagem);

//           try {
//             await Notificacao.create({
//               agenda_id: agenda.id,
//               usuario_id: agenda.usuario_id,
//               data_notificacao: new Date(),
//               mensagem: mensagem,
//               confirmacao_presenca: false
//             });
//           } catch (error) {
//             console.error(error);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Configurar o agendamento para rodar a cada X minutos (por exemplo, a cada 5 minutos)
// cron.schedule('*/1 * * * *', controller.scheduleAlertStartNotifications);

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
  
        // Defina o intervalo de minutos desejado
        const intervaloMinutos = 15; // Por exemplo, notificar com 15 minutos restantes
  
        if (timeDifference <= intervaloMinutos * oneMinuteInMillis && timeDifference > 0) {
          const existingNotification = await Notificacao.findOne({
            where: { agenda_id: agenda.id }
          });
  
          if (!existingNotification) {
            const usuario = await Usuario.findByPk(agenda.usuario_id);
            const minutosFaltantes = Math.floor(timeDifference / oneMinuteInMillis);
            const mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a finalizar em ${minutosFaltantes} minutos.`;
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
        // Adicione outra condição para notificar quando a agenda acabar
        else if (timeDifference <= 0) {
          const existingNotification = await Notificacao.findOne({
            where: { agenda_id: agenda.id }
          });
  
          if (!existingNotification) {
            const usuario = await Usuario.findByPk(agenda.usuario_id);
            const mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" acabou.`;
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
  // Configurar o agendamento para rodar a cada X minutos (por exemplo, a cada 5 minutos)
  cron.schedule('*/1 * * * *', controller.scheduleAlertFinishNotifications);


  controller.scheduleStartNotifications = async()=>{
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

        if (timeDifference <= 0) {
          const existingNotification = await Notificacao.findOne({
            where: { agenda_id: agenda.id }
          });
  
          if (!existingNotification) {
            const usuario = await Usuario.findByPk(agenda.usuario_id);
            const mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" começou.`;
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
  // Configurar o agendamento para rodar a cada X minutos (por exemplo, a cada 5 minutos)
cron.schedule('*/1 * * * *', controller.scheduleStartNotifications);

// controller.scheduleFinishNotifications = async () => {
//   try {
//     const agendas = await Agenda.findAll({
//       where: {
//         data_horario_fim: {
//           [Op.gte]: new Date(), // A partir do horário atual
//         }
//       }
//     });

//     console.log("Agendas encontradas:", agendas); // Adicione este log para verificar se as agendas estão sendo recuperadas corretamente

//     for (const agenda of agendas) {
//       const timeDifference = agenda.data_horario_fim.getTime() - new Date().getTime();

//       console.log("Time Difference:", timeDifference); // Adicione este log para verificar a diferença de tempo

//       if (timeDifference <= 0) {
//         console.log("Agenda expirada:", agenda); // Adicione este log para verificar se a lógica dentro do loop está sendo executada corretamente

//         const existingNotification = await Notificacao.findOne({
//           where: { agenda_id: agenda.id }
//         });

//         if (!existingNotification) {
//           const usuario = await Usuario.findByPk(agenda.usuario_id);
//           const mensagem = `Olá ${usuario.nome}, sua agenda "${agenda.titulo_agenda}" encerrou.`;
//           console.log(mensagem);

//           try {
//             await Notificacao.create({
//               agenda_id: agenda.id,
//               usuario_id: agenda.usuario_id,
//               data_notificacao: new Date(),
//               mensagem: mensagem,
//               confirmacao_presenca: false
//             });
//             console.log("Notificação criada com sucesso!"); // Adicione este log para verificar se a notificação está sendo criada corretamente
//           } catch (error) {
//             console.error("Erro ao criar notificação:", error); // Adicione este log para capturar erros na criação da notificação
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Erro ao buscar agendas:", error); // Adicione este log para capturar erros na recuperação das agendas
//   }
// };

//   cron.schedule('*/1 * * * *', controller.scheduleFinishNotifications);

  module.exports = controller;  