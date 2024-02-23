// Importa os modelos necessários para o controller: HistoricoJogo, Usuario e Jogo
const { HistoricoJogo, Usuario, Jogo } = require('../models');

// Cria um objeto vazio para o controlador
const controller = {};

/*
    Métodos CRUD do controller:
    - create: Cria um novo registro de histórico de jogo
    - retrieve: Lista (recupera) todos os registros de histórico de jogo do usuário autenticado
    - retrieveOne: Lista (recupera) um registro específico de histórico de jogo do usuário autenticado
    - update: Atualiza um registro específico de histórico de jogo do usuário autenticado
    - delete: Deleta um registro específico de histórico de jogo do usuário autenticado
*/

// Método para criar um novo registro de histórico de jogo
controller.create = async (req, res) => {
    // Adiciona o id do usuário autenticado ao corpo da requisição
    req.body.usuario_id = req.authUser.id;

    try {
        // Cria um novo registro de histórico de jogo no banco de dados
        await HistoricoJogo.create(req.body);
        // HTTP 201: Created
        res.status(201).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar todos os registros de histórico de jogo do usuário autenticado
controller.retrieve = async (req, res) => {
    try {
        // Busca todos os registros de histórico de jogo do usuário autenticado
        const data = await HistoricoJogo.findAll({
            where: { usuario_id: req.authUser.id } // Filtra apenas os registros do usuário autenticado
        });
        // Retorna os dados encontrados
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

// Método para recuperar um registro específico de histórico de jogo do usuário autenticado
controller.retrieveOne = async (req, res) => {
    try {
        // Busca um registro específico de histórico de jogo do usuário autenticado pelo id
        const data = await HistoricoJogo.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id } // Filtra pelo id do jogo e do usuário autenticado
        });
        // Se o registro for encontrado, retorna os dados, caso contrário, retorna HTTP 404: Not Found
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

// Método para atualizar um registro específico de histórico de jogo do usuário autenticado
controller.update = async (req, res) => {
    try {
        // Atualiza um registro específico de histórico de jogo do usuário autenticado pelo id
        const response = await HistoricoJogo.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
        );
        // Se a atualização for bem-sucedida, retorna HTTP 204: No Content, caso contrário, retorna HTTP 404: Not Found
        if (response[0] > 0) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

// Método para deletar um registro específico de histórico de jogo do usuário autenticado
controller.delete = async (req, res) => {
    try {
        // Deleta um registro específico de histórico de jogo do usuário autenticado pelo id
        const response = await HistoricoJogo.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
        );
        // Se a exclusão for bem-sucedida, retorna HTTP 204: No Content, caso contrário, retorna HTTP 404: Not Found
        if (response) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

// Exporta o controlador
module.exports = controller;
