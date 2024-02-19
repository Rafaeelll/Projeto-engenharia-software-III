// importar o model correspondente ao controller
const {UsuarioFoto, Usuario} = require('../models')

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
    // req.body.usuario_id = req.authUser.id; // Adiciona o id do usuário ao corpo da requisição
    const {originalname: name, size, key, location: url = ""} = req.file;
    try{
        await UsuarioFoto.create({
            usuario_id: req.body.usuario_id,
            name,
            size,
            key,
            url
        })
        return res.status(201).json(UsuarioFoto); // HTTP 201: Created
    }
    catch(error){
        console.error(error)
    }
}
controller.retrieve = async (req, res)=>{
    try{
        const data = await UsuarioFoto.findAll({
            include: [
                {model: Usuario, as: 'usuario'},
            ],
            // where: { usuario_id: req.authUser.id } // Filtra apenas os visualizações do usuário autenticado

        })
        res.send(data)

    }
    catch(error){
        console.error(error)
    }
}
controller.retrieveOne = async (req, res)=>{
    try {
        const data = await UsuarioFoto.findOne({
            where: { id: req.params.id}
        });
        if (data) res.send(data);
        else res.status(404).end();
    } catch (error) {
        console.error(error);
    }
};
controller.update = async (req, res) => {
    try {
        // Verifica se req.file está definido
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname: name, size, key, location: url = "" } = req.file;
        const { usuario_id } = req.body.usuario_id;

        const response = await UsuarioFoto.update(
            { 
                // Dados a serem atualizados
                usuario_id,
                name,
                size,
                key,
                url
            },
            { 
                // Condição para atualização
                where: { id: req.params.id }
            }
        );

        if (response[0] > 0) {
            // HTTP 204: No content
            res.status(204).end();
        } else {
            // Não encontrou o registro para atualizar
            // HTTP 404: Not found
            res.status(404).end();
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

controller.delete = async (req, res) =>{
    try{
        const response = await UsuarioFoto.destroy(
            { where: { id: req.params.id }     }   )
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