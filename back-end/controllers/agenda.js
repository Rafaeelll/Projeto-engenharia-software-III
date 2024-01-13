// importar o model correspondente ao controller
const {Agenda, Usuario, Jogo, Visualizacao} = require('../models')


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
    req.body.usuario_id = req.authUser.id; // Adiciona o id do usuário ao corpo da requisição

    try{
        const { data_horario_inicio, data_horario_fim } = req.body;

        // Verifique se a data de início é anterior à data atual
        const dataAtual = new Date();
        if (data_horario_inicio < dataAtual && data_horario_fim < dataAtual || 
            data_horario_inicio < dataAtual && data_horario_fim <= dataAtual) {
            req.body.status = 'Finalizada';
        } else if (data_horario_inicio <= dataAtual && data_horario_fim >= dataAtual) {
            req.body.status = 'Em andamento';
        } else {
            req.body.status = 'Agendado';
        }

        await Agenda.create(req.body)
        // HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieve = async (req, res) => {
    try {
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

controller.retrieveOne = async (req, res) => {
    try {
        const data = await Agenda.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela agenda do usuário autenticado
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

controller.update = async (req, res) => {
    try {
        const response = await Agenda.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
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
        const response = await Agenda.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
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