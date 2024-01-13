// importar o model correspondente ao controller
const {Jogo, Agenda, Usuario, HistoricoJogo} = require('../models')


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
        await Jogo.create(req.body)
        // HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Tratamento do erro de violação de chave única
            res.status(400).send({ error: 'Nome do jogo já existe.' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}

controller.retrieve = async (req, res)=>{
    try{
        const data = await Jogo.findAll({
            include: [
                {model: Agenda, as: 'agendas'},
                {model: Usuario, as: 'usuario'},
                {model: HistoricoJogo, as: 'historico_jogos'},
            ],
            where: {usuario_id: req.authUser.id}
        })
        res.send(data)
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieveOne = async (req, res)=>{
    try {
        const data = await Jogo.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id } // Filtra pelo id do jogo e do usuário autenticado
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};

controller.update = async(req, res) =>{
    try{
        const response = await Jogo.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
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
        const response = await Jogo.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pelo id do jogo e do usuário autenticado
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

module.exports = controller;