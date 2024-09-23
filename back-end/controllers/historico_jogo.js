// Importa os modelos necessários para o controller: HistoricoJogo, Usuario e Jogo
const { HistoricoJogo, Usuario, Jogo } = require('../models');
const { Op, where } = require('sequelize');

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
        // Verifica se já existe um registro de histórico para o jogo fornecido
        const existingHistorico = await HistoricoJogo.findOne({
            where: { jogo_id: req.body.jogo_id } // Filtra pelo id do jogo
        });

        // Se já existe um registro de histórico para o jogo, retorna um erro
        if (existingHistorico) {
            return res.status(418).send("Já existe um registro de histórico para este jogo.");
        }

        // Cria um novo registro de histórico de jogo no banco de dados
        await HistoricoJogo.create(req.body);
        // HTTP 201: Created
        res.status(201).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor.");
    }
};

// Método para recuperar todos os registros de histórico de jogo do usuário autenticado
controller.retrieve = async (req, res) => {
    try {
        // Busca todos os registros de histórico de jogo do usuário autenticado
        const data = await HistoricoJogo.findAll({
            where: { usuario_id: req.authUser.id }, // Filtra apenas os registros do usuário autenticado
            include:[
                {model: Usuario, as: 'usuario'},
                {model: Jogo, as: 'jogo'},
            ]
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
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pelo id do jogo e do usuário autenticado
            include:[
                {model: Usuario, as: 'usuario'},
                {model: Jogo, as: 'jogo'},
            ]
        });
        // Se o registro for encontrado, retorna os dados, caso contrário, retorna HTTP 404: Not Found
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

controller.update = async (req, res) => {
    try {
        const { jogo_id } = req.body; // ID do jogo a ser atualizado
        const { id: historicoId } = req.params; // ID do histórico que está sendo atualizado

        // Verifica se já existe um registro de histórico para o jogo fornecido,
        // exceto se for o registro que está sendo atualizado
        const existingHistorico = await HistoricoJogo.findOne({
            where: {
                jogo_id: jogo_id,
                id: { [Op.ne]: historicoId } // Ignora o histórico atual
            }
        });

        // Se já existe um registro de histórico para o jogo, retorna um erro
        if (existingHistorico) {
            return res.status(418).send("Já existe um registro de histórico para este jogo.");
        }

        // Atualiza um registro específico de histórico de jogo do usuário autenticado pelo id
        const response = await HistoricoJogo.update(
            req.body,
            { where: { id: historicoId, usuario_id: req.authUser.id } } // Filtra pelo id do histórico e do usuário autenticado
        );

        // Se a atualização for bem-sucedida, retorna HTTP 204: No Content, caso contrário, retorna HTTP 404: Not Found
        if (response[0] > 0) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar histórico de jogo.' });
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
