// Importa os modelos necessários para o controlador
const { Jogo, Agenda, Usuario, HistoricoJogo } = require('../models');
const { Op, where } = require('sequelize');

// Objeto controlador para os métodos CRUD
const controller = {};

/*
    Métodos CRUD do controlador:
    - create: Cria um novo registro de jogo.
    - retrieve: Lista (recupera) todos os registros de jogo associados ao usuário autenticado.
    - retrieveOne: Lista (recupera) um registro de jogo específico associado ao usuário autenticado.
    - update: Atualiza um registro de jogo específico associado ao usuário autenticado.
    - delete: Deleta um registro de jogo específico associado ao usuário autenticado.

    Este código define um controlador para operações CRUD (Create, Read, Update, Delete) em registros de jogos. 
    Cada método executa uma operação específica no banco de dados, lidando com a criação, 
    recuperação, atualização e exclusão de registros de histórico de jogos, com base no usuário autenticado.
*/

// Método para criar um novo registro de jogo
controller.create = async (req, res) => {
    // Adiciona o id do usuário autenticado ao corpo da requisição
    req.body.usuario_id = req.authUser.id;

    try {
        // Verifica se já existe um jogo com o mesmo nome para o usuário atual
        const existingGame = await Jogo.findOne({
            where: {
                nome: req.body.nome,
                usuario_id: req.authUser.id
            }
        });

        if (existingGame) {
            // Se já existir um jogo com o mesmo nome para o usuário atual, retorna um erro
            return res.status(410).send({ error: 'Você já possui um jogo com esse nome.' });
        }
        req.body.preco_jogo = parseFloat(req.body.preco_jogo);

        // Cria um novo registro de jogo no banco de dados
        await Jogo.create(req.body);
        // HTTP 201: Created
        res.status(201).end();
    } catch (error) {
        // Tratamento de erros
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send({ error: 'Nome do jogo já existe.' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
};

// Método para recuperar todos os registros de jogo associados ao usuário autenticado
controller.retrieve = async (req, res) => {
    try {
        const data = await Jogo.findAll({
            // Inclui associações com outros modelos
            include: [
                { model: Agenda, as: 'agendas' },
                { model: Usuario, as: 'usuario' },
                { model: HistoricoJogo, as: 'historico_jogos' },
            ],
            // Filtra pelos jogos associados ao usuário autenticado
            where: { usuario_id: req.authUser.id }
        });
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar um registro de jogo específico associado ao usuário autenticado
controller.retrieveOne = async (req, res) => {
    try {
        const data = await Jogo.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pelo id do jogo e do usuário autenticado
            include: [
                { model: Agenda, as: 'agendas' },
                { model: Usuario, as: 'usuario' },
                { model: HistoricoJogo, as: 'historico_jogos' },
            ],
        });
        // Retorna o registro se encontrado, caso contrário, retorna HTTP 404: Not Found
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para atualizar um registro de jogo específico associado ao usuário autenticado
controller.update = async (req, res) => {
    try {
        const {id: jogoId} = req.params
        // Verifica se já existe um jogo com o mesmo nome para o usuário atual
        const existingGame = await Jogo.findOne({
            where: {
                nome: req.body.nome,
                id: {[Op.ne]: jogoId}
            }
        });

        if (existingGame && existingGame.id !== req.params.id) {
            // Se já existir um jogo com o mesmo nome para o usuário atual, retorna um erro
            return res.status(410).send({ error: 'Você já possui um jogo com esse nome.' });
        }
        // Converte o preço para decimal antes de atualizar
        if (req.body.preco_jogo !== undefined) {
            req.body.preco_jogo = parseFloat(req.body.preco_jogo);
        }
        // Atualiza o registro de jogo específico associado ao usuário autenticado
        const response = await Jogo.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
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

// Método para deletar um registro de jogo específico associado ao usuário autenticado
controller.delete = async (req, res) => {
    try {
        // Deleta o registro de jogo específico associado ao usuário autenticado
        const response = await Jogo.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
        );
        // Verifica se a exclusão foi bem-sucedida e retorna a resposta apropriada
        if (response) {
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

// Exporta o controlador para uso em outros arquivos
module.exports = controller;
