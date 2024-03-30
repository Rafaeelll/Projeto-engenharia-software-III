// Importa os modelos necessários para o controlador
const { Notificacao, Agenda, Usuario } = require('../models');
// Importa o módulo cron para agendar tarefas
const cron = require('node-cron');
// Importa o operador de Sequelize
const { Op, where } = require('sequelize');

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

// Método para criar automaticamente notificações com base nas agendas
controller.createAutomaticStartNotifications = async () => {
    try {
        const agendas = await Agenda.findAll({
            where: {
                data_horario_inicio: { [Op.gte]: new Date() }, // Agendas que ainda não começaram   
            },
            include: ['usuario'] // Inclui o usuário associado à agenda
        });

        for (const agenda of agendas) {
            // Verifica se a agenda tem uma hora de antecedência
            const umHoraAntesInicio = new Date(agenda.data_horario_inicio);
            umHoraAntesInicio.setHours(umHoraAntesInicio.getHours() - 1);

            // Verifica se já existe uma notificação para uma hora antes do início da agenda
            const notificationExists = await Notificacao.findOne({
                where: {
                    agenda_id: agenda.id,
                    data_notificacao: umHoraAntesInicio
                }
            });

            // Se não houver notificação para uma hora antes do início da agenda, cria uma
            if (!notificationExists) {
                await Notificacao.create({
                    agenda_id: agenda.id,
                    usuario_id: agenda.usuario_id,
                    data_notificacao: umHoraAntesInicio,
                    mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" está prestes a começar em 1 hora. Confirme sua presença clicando no ícone "Editar".`,
                    confirmacao_presenca: false,              
                    confirmacao_finalizacao: false,
                    configuracao: null,
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

// Configura o agendamento para criar automaticamente notificações a cada X minutos
cron.schedule('*/1 * * * *', controller.createAutomaticStartNotifications);

controller.createAutomaticFinishNotifications = async() =>{
    try{
        const agendaTerminadas = await Agenda.findAll({
            where: {
                data_horario_fim: { [Op.lte]: new Date() }, // / Agendas cujo horário de fim já passou
            },
            include: ['usuario']
        })
        for (const agenda of agendaTerminadas){
            const notificationEndExists = await Notificacao.findOne({
                where:{
                    agenda_id: agenda.id,
                    data_notificacao: agenda.data_horario_fim
                }
            });
            // Se não houver notificação para o término da agenda, cria uma
            if (!notificationEndExists){
                await Notificacao.create({
                    agenda_id: agenda.id,
                    usuario_id: agenda.usuario_id,
                    data_notificacao: agenda.data_horario_fim,
                    mensagem: `Olá ${agenda.usuario.nome}, sua agenda "${agenda.titulo_agenda}" já finalizou. Confirme a finalização clicando no ícone "Editar".`,
                    confirmacao_presenca: false,              
                    confirmacao_finalizacao: false,
                    configuracao: null,
                });
            }
        }
    } catch (error) {
        console.error(error)
    }
}
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

controller.updateNotificationCountToZero = async (req, res) => {
    try {
        const notificacoes = await Notificacao.findAll({ where: { usuario_id: req.authUser.id } });
        const ids = notificacoes.map(notificacao => notificacao.id);

        if (ids.length > 0) {
            await Notificacao.update({ count: 0 }, { where: { id: ids } });
            res.send({ message: 'Contagem de notificações atualizada para zero.' });
        } else {
            res.send({ message: 'Não há notificações para atualizar.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela notificação do usuário autenticado
            include: [
                { model: Agenda, as: 'agenda' },
                { model: Usuario, as: 'usuario' }
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

// Exporta o controlador
module.exports = controller;  
