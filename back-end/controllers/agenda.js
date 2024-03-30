// Importa os modelos correspondentes ao controller
const { Agenda, Usuario, Jogo, Visualizacao } = require('../models');

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

module.exports = controller; // Exporta o controlador
