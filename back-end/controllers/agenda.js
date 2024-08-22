// Importa os modelos correspondentes ao controller
const { Agenda, Usuario, Jogo, Visualizacao, Configuracao } = require('../models');
const cron = require('node-cron');
const { Op, where } = require('sequelize');

/*
    metodos CRUD do controller
    create: Cria um novo registro
    retrieve: lista (recupera) todos os registros
    retrieveOne: Lista (recupera) um registro
    uptade: atualiza um registro
    delete: deletar um registro

    Este código define um controlador para operações CRUD (Create, Read, Update, Delete) 
    em registros de agendas. Cada método executa uma operação específica no banco de dados, 
    lidando com a criação, recuperação, atualização e exclusão de registros de agendas, com base no usuário autenticado.
*/

// Objeto controlador para os métodos CRUD
const controller = {};

// Método para criar um novo registro de agenda
controller.create = async (req, res) => {
    // Adiciona o id do usuário ao corpo da requisição
    req.body.usuario_id = req.authUser.id;
    req.body.config_id = req.authUser.id

    try {
        // Cria a agenda no banco de dados
        await Agenda.create(req.body);
        // HTTP 201: Created
        res.status(201).end();
    } catch(error) {
        console.error(error);
    }
};

// Método para recuperar todas as agendas de um usuário
controller.retrieve = async (req, res) => {
    try {
        // Busca todas as agendas do usuário autenticado
        const data = await Agenda.findAll({
            where: { usuario_id: req.authUser.id }, // Filtra apenas as agendas do usuário autenticado
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Jogo, as: 'jogo' },
                { model: Visualizacao, as: 'visualizacoes' }
            ]
        });
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar uma agenda específica de um usuário
controller.retrieveOne = async (req, res) => {
    try {
        // Busca uma agenda específica do usuário autenticado
        const data = await Agenda.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela agenda do usuário autenticado
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Jogo, as: 'jogo' },
                { model: Visualizacao, as: 'visualizacoes' }
            ]
        });
        // Retorna a agenda se encontrada, caso contrário, retorna HTTP 404: Not Found
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar agendas filtradas por status
controller.retrieveByStatus = async (req, res) => {
    const { status } = req.query; // Obtenha o status do parâmetro de consulta
    try {
        // Busca todas as agendas do usuário autenticado filtradas pelo status fornecido
        const data = await Agenda.findAll({
            where: { usuario_id: req.authUser.id, status }, // Filtra agendas pelo usuário autenticado e pelo status
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Jogo, as: 'jogo' },
                { model: Visualizacao, as: 'visualizacoes' }
            ]
        });
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

// Método para atualizar uma agenda específica de um usuário
controller.update = async (req, res) => {
    try {
        // Atualiza a agenda específica do usuário autenticado
        const response = await Agenda.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
        );
        // Retorna HTTP 204: No Content se a atualização for bem-sucedida, caso contrário, retorna HTTP 404: Not Found
        if (response[0] > 0) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

// Método para deletar uma agenda específica de um usuário
controller.delete = async (req, res) => {
    try {
        // Deleta a agenda específica do usuário autenticado
        const response = await Agenda.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
        );
        // Retorna HTTP 204: No Content se a exclusão for bem-sucedida, caso contrário, retorna HTTP 404: Not Found
        if (response) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

controller.updateAgendaStatusAuto = async (req, res) => {
    try {
        let atualizacoesFeitas = 0;
        const now = new Date();
        console.log(`Iniciando atualização de status em ${now}`);

        // Verificando as agendas que já inicializaram
        const agendasInicializadas = await Agenda.findAll({
            where: {
                data_horario_inicio: { [Op.lte]: now },
                confirmacao_presenca: false
            },
            include: ['usuario']
        });

        console.log(`Agendas inicializadas encontradas: ${agendasInicializadas.length}`);
        agendasInicializadas.forEach(agenda => {
            console.log(`Agenda ID: ${agenda.id}, Data Início: ${agenda.data_horario_inicio}, Data Fim: ${agenda.data_horario_fim}`);
        });

        // Atualizando o status das agendas que já inicializaram
        for (const agenda of agendasInicializadas) {
            if (agenda) {
                const configuracao = await Configuracao.findOne({
                    where: { usuario_id: agenda.usuario_id }
                });

                if (configuracao) {
                    const novoStatus = configuracao.confirmar_auto_ini ? 'Em andamento' : 'Inicialização Pendente';
                    if (agenda.status !== 'Inicialização Pendente' && agenda.status !== 'Em andamento' && agenda.status !== 'Finalização Pendente'){
                        await Agenda.update({ status: novoStatus }, {
                            where: { id: agenda.id }
                        });
                        atualizacoesFeitas++;
                    }
                    console.log(`Agenda ID ${agenda.id} atualizada para status ${novoStatus}`);
                } else {
                    console.log(`Configuração não encontrada para usuario_id ${agenda.usuario_id}`);
                }
            }
        }

        // Verificando as agendas que já finalizaram
        const agendasTerminadas = await Agenda.findAll({
            where: {
                data_horario_fim: { [Op.lte]: now },
                confirmacao_finalizacao: false
            }
        });

        console.log(`Agendas terminadas encontradas: ${agendasTerminadas.length}`);
        agendasTerminadas.forEach(agenda => {
            console.log(`Agenda ID: ${agenda.id}, Data Início: ${agenda.data_horario_inicio}, Data Fim: ${agenda.data_horario_fim}`);
        });

        // Atualizando o status das agendas que já finalizaram
        for (const agenda of agendasTerminadas) {
            if (agenda) {
                const configuracao = await Configuracao.findOne({
                    where: { usuario_id: agenda.usuario_id }
                });

                if (configuracao) {
                    const novoStatus = configuracao.confirmar_auto_fim ? 'Finalizada' : 'Finalização Pendente';
                    if (agenda.status !== 'Finalização Pendente' && agenda.status !== 'Finalizada'){
                        await Agenda.update({ status: novoStatus }, {
                            where: { id: agenda.id }
                        });
                        atualizacoesFeitas++;
                    }
                    console.log(`Agenda ID ${agenda.id} atualizada para status ${novoStatus}`);
                } else {
                    console.log(`Configuração não encontrada para usuario_id ${agenda.usuario_id}`);
                }
            }
        }

        const mensagem = `Status das agendas atualizado com sucesso. Total de atualizações: ${atualizacoesFeitas}`;
        console.log(mensagem);

        if (res) {
            res.status(200).send(mensagem);
        }
    } catch (error) {
        console.error(error);
        if (res) {
            res.status(500).send('Erro ao atualizar o status das agendas.');
        }
    }
};

// Agendamento com cron job
cron.schedule('*/1 * * * *', () => controller.updateAgendaStatusAuto(null, null));

controller.updateAgendaConfirmations = async (req, res) => {
    try {
        // Busca a agenda que será atualizada
        const agenda = await Agenda.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }
        });

        if (!agenda) {
            return res.status(404).end(); // Retorna 404 se a agenda não for encontrada
        }

        // Extrai os valores recebidos no corpo da requisição
        const { confirmacao_presenca, confirmacao_finalizacao } = req.body;

        // Calcula as datas e horários
        const dataAtual = new Date();
        const dataInicial = new Date(agenda.data_horario_inicio);
        const dataFinal = new Date(agenda.data_horario_fim);
        
        let statusAgenda = "Agendado";
        
        // Verifica o status com base no horário atual e nas datas de início e fim
        if (dataAtual >= dataInicial) {
            if (confirmacao_presenca) {
                statusAgenda = "Inicialização Confirmada";
            } else {
                statusAgenda = "Inicialização Pendente";
            }
        } else if (dataAtual >= dataFinal) {
            if (confirmacao_finalizacao) {
                statusAgenda = "Finalização Confirmada";
            } else {
                statusAgenda = "Finalização Pendente";
            }
        }

        // Garantir que confirmacao_presenca seja true se confirmacao_finalizacao for true
        const confirmacaoPresencaFinal = confirmacao_finalizacao && !confirmacao_presenca ? true : confirmacao_presenca;

        // Atualiza os campos no banco de dados diretamente
        const response = await Agenda.update(
            {
                confirmacao_presenca: confirmacaoPresencaFinal,
                confirmacao_finalizacao,
                status: statusAgenda
            },
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
        );

        // Retorna HTTP 204: No Content se a atualização for bem-sucedida
        if (response[0] > 0) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar a agenda.');
    }
};


module.exports = controller; // Exporta o controlador