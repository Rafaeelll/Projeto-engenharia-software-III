// importar o model correspondente ao controller
const {HistoricoJogo, Usuario, Jogo} = require('../models')
const authorizationMiddleware = require('../lib/authorizationMiddleware');


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
        await HistoricoJogo.create(req.body)
        // HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieve = async (req, res) => {
    try {
        const data = await HistoricoJogo.findAll({
            where: { usuario_id: req.authUser.id } // Filtra apenas os jhistorico de jogos do usuário autenticado
        });
        res.send(data);
    } catch (error) {
        console.error(error);
    }
};

controller.retrieveOne = async (req, res) => {
    try {
        const data = await HistoricoJogo.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id } // Filtra pelo id do jogo e do usuário autenticado
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

controller.update = async (req, res) => {
    try {
        const response = await HistoricoJogo.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
        );
        if (response[0] > 0) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

controller.delete = async (req, res) => {
    try {
        const response = await HistoricoJogo.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
        );
        if (response) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = controller;