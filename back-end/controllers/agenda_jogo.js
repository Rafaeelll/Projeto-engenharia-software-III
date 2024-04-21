// importar o model correspondente ao controller
const {AgendaJogo, Agenda, Jogo} = require('../models')

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
        req.body.usuario_id = req.authUser.id;

        await AgendaJogo.create(req.body)
        // HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieve = async (req, res)=>{
    try{
        const data = await AgendaJogo.findAll({
            where: { usuario_id: req.authUser.id }, // Filtra apenas as agendas do usuário autenticado
            include: [
                {model: Agenda, as: 'agenda'},
                {model: Jogo, as: 'jogo'}
            ]
        })
        res.send(data)

    }
    catch(error){
        console.error(error)
    }
}
controller.retrieveOne = async (req, res)=>{
    try{
        const data = await AgendaJogo.findByPk({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela agenda do usuário autenticado
            include: [
                {model: Agenda, as: 'agenda'},
                {model: Jogo, as: 'jogo'}
            ]
        })

        if(data) res.send(data)
        
        else res.status(404).end()
    }
    catch(error){
        console.error(error)
    }
}
controller.update = async(req, res) =>{
    try{
        const response = await AgendaJogo.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
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
        const response = await AgendaJogo.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela agenda do usuário autenticado
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