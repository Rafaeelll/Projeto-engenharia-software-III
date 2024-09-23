// Importa os modelos correspondentes ao controller
const { Agenda, Usuario, Jogo, Visualizacao, Configuracao, AgendaJogo, sequelize } = require('../models');
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

// Função para verificar se já existe uma agenda no intervalo de tempo
async function checkAgendaConflict(usuarioId, dataHorarioInicio, dataHorarioFim, agendaId) {
    const agendaConflict = await Agenda.findOne({
        where: {
            usuario_id: usuarioId,
            id: { [Op.ne]: agendaId }, // Ignora a agenda que está sendo atualizada
            [Op.or]: [
                {
                    data_horario_inicio: { [Op.lte]: dataHorarioInicio },
                    data_horario_fim: { [Op.gte]: dataHorarioInicio },
                },
                {
                    data_horario_inicio: { [Op.lte]: dataHorarioFim },
                    data_horario_fim: { [Op.gte]: dataHorarioFim },
                },
                {
                    data_horario_inicio: { [Op.gte]: dataHorarioInicio },
                    data_horario_fim: { [Op.lte]: dataHorarioFim },
                }
            ]
        }
    });

    return !!agendaConflict;
}
  

controller.create = async (req, res) => {
    const {data_horario_inicio, data_horario_fim, p_data_horario_inicio, p_data_horario_fim} = req.body;
    const usuario_id = req.authUser.id
    const transaction = await sequelize.transaction();
  
    try {
    // Verifica se existe conflito de agenda no intervalo de tempo
    const agendaConflict = await checkAgendaConflict(usuario_id, data_horario_inicio, data_horario_fim);
    if (agendaConflict) {
      return res.status(409).json({ message: 'Já existe uma agenda nesse intervalo de tempo!' });
    }

    // Calcula a duração da agenda em horas
    const duration = (new Date(data_horario_fim) - new Date(data_horario_inicio)) / (1000 * 60 * 60);

    // Verifica se a agenda tem mais de 3 horas e se as pausas foram informadas
    if (duration >= 3) {
      if (!p_data_horario_inicio || !p_data_horario_fim) {
        return res.status(422).json({ message: 'Para agendas com mais de 3 horas, é obrigatório informar o horário de início e fim da pausa.' });
      }
    }

    // Verifica se jogos associados foram informados
    const jogoIds = req.body.jogo_id;
    if (!jogoIds || jogoIds.length === 0) {
      return res.status(400).json({ message: 'É necessário informar ao menos um jogo associado.' });
    }
      // Cria a agenda
      const agenda = await Agenda.create({
        usuario_id,
        config_id: req.authUser.id,
        jogos_associados: req.body.jogos_associados,
        data_horario_inicio,
        data_horario_fim,
        p_data_horario_inicio,
        p_data_horario_fim,
        titulo_agenda: req.body.titulo_agenda,
        plt_transm: req.body.plt_transm,
        descricao: req.body.descricao,
        confirmacao_presenca: req.body.confirmacao_presenca,
        confirmacao_finalizacao: req.body.confirmacao_finalizacao,
        status: req.body.status,
      }, { transaction });
  
        // Itera sobre os jogo_ids e insere na tabela intermediária
        for (const jogo_id of jogoIds) {
        await AgendaJogo.create({
            agenda_id: agenda.id,
            jogo_id: jogo_id
        }, { transaction });
        }

        // Commit da transação
        await transaction.commit();

        res.status(201).json(agenda);
    } catch (error) {
        // Rollback da transação em caso de erro
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar agenda' });
    } finally {
        // Garante que a transação é finalizada
        if (!transaction.finished) await transaction.commit();
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
                { model: Visualizacao, as: 'visualizacoes' },
                { model: Jogo, as: 'jogos'}

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
            where: { id: req.params.id, usuario_id: req.authUser.id },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Jogo, as: 'jogos' },
                { model: Visualizacao, as: 'visualizacoes' }
            ]
        });

        // Retorna a agenda se encontrada, caso contrário, retorna HTTP 404: Not Found
        if (data) {
            // Transformando os dados de jogos em um array de IDs
            const jogos = data.jogos.map(jogo => jogo.id); // ou outro campo que você queira
            res.send({ ...data.toJSON(), jogo_id: jogos });
        } else {
            res.status(404).json({ message: 'Agenda não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar a agenda.', error: error.message });
    }
};


// Método para recuperar agendas filtradas por status
controller.retrieveByStatus = async (req, res) => {
    const { status } = req.params; // Obtenha o status do parâmetro de consulta
    try {
        // Busca todas as agendas do usuário autenticado filtradas pelo status fornecido
        const data = await Agenda.findAll({
            where: { usuario_id: req.authUser.id, status: status }, // Filtra agendas pelo usuário autenticado e pelo status
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Jogo, as: 'jogos' },
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
    const { data_horario_inicio, data_horario_fim, p_data_horario_inicio, p_data_horario_fim, jogos_associados } = req.body;
    const { id: agendaId } = req.params;  // ID da agenda sendo atualizada
    const usuario_id = req.authUser.id;  // ID do usuário autenticado
    const transaction = await sequelize.transaction(); // Transação para garantir atomicidade

    try {
        // Busca a agenda atual para verificar se ela existe
        const agendaExistente = await Agenda.findOne({
            where: { id: agendaId, usuario_id: usuario_id }
        });

        // Se a agenda não existir, retorna 404
        if (!agendaExistente) {
            return res.status(404).json({ message: 'Agenda não encontrada.' });
        }

        // Verifica se os horários foram alterados e se o novo intervalo de tempo conflita com outra agenda
        if (agendaExistente.data_horario_inicio !== data_horario_inicio || agendaExistente.data_horario_fim !== data_horario_fim) {
            const agendaConflict = await checkAgendaConflict(usuario_id, data_horario_inicio, data_horario_fim);

            // Se houver conflito e não for a mesma agenda, retorna erro
            if (agendaConflict) {
                return res.status(409).json({ message: 'Conflito de agenda no intervalo de tempo.' });
            }
        }

        // Calcula a duração da agenda em horas
        const duration = (new Date(data_horario_fim) - new Date(data_horario_inicio)) / (1000 * 60 * 60);

        // Verifica se a agenda tem mais de 3 horas e se as pausas foram informadas
        if (duration >= 3) {
            if (!p_data_horario_inicio || !p_data_horario_fim) {
                return res.status(422).json({ message: 'Para agendas com mais de 3 horas, é obrigatório informar o horário de início e fim da pausa.' });
            }
        }

        // Atualiza a agenda específica do usuário autenticado
        const response = await Agenda.update(
            req.body,
            { where: { id: agendaId, usuario_id: usuario_id }, transaction }  // Usa transação
        );

        // Se a atualização não for bem-sucedida, retorna 404
        if (response[0] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Falha ao atualizar a agenda.' });
        }

        // Remove as associações antigas se novos jogos foram informados
        if (jogos_associados && jogos_associados.length > 0) {
            await AgendaJogo.destroy({ where: { agenda_id: agendaId }, transaction });
                // Verifica se jogos associados foram informados
            const jogoIds = req.body.jogo_id;
            // Adiciona as novas associações na tabela intermediária
            for (const jogo_id of jogoIds) {
                await AgendaJogo.create({
                    agenda_id: agendaId,
                    jogo_id: jogo_id
                }, { transaction });
            }
        }

        // Commit da transação
        await transaction.commit();
        res.status(204).end();

    } catch (error) {
        // Rollback da transação em caso de erro
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a agenda.' });
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
                    const novaConfirmPresenca = configuracao.confirmar_auto_ini ? true : false
                    if (agenda.status !== 'Inicialização Pendente' && agenda.status !== 'Em andamento' && agenda.status !== 'Finalização Pendente' && agenda.status !== 'Finalização Confirmada'){
                        await Agenda.update({ status: novoStatus, confirmacao_presenca: novaConfirmPresenca}, {
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
                    const novaConfirmFinalizacao = configuracao.confirmar_auto_ini ? true : false
                    if (agenda.status !== 'Finalização Pendente' && agenda.status !== 'Finalizada'){
                        await Agenda.update({ status: novoStatus, confirmacao_finalizacao: novaConfirmFinalizacao}, {
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