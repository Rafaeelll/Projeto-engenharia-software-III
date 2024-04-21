// Importar o model correspondente ao controller
const {Visualizacao, Usuario, Agenda} = require('../models') // Importa os modelos necessários para o controlador

const controller = {} // Objeto vazio para o controlador

/*
    Métodos CRUD do controller
    create: Cria um novo registro de visualização
    retrieve: Lista todas as visualizações do usuário autenticado
    retrieveOne: Lista uma visualização específica do usuário autenticado
    update: Atualiza uma visualização específica do usuário autenticado
    delete: Deleta uma visualização específica do usuário autenticado

    Este controlador lida com operações CRUD relacionadas às visualizações, permitindo que os usuários 
    visualizem agendas e outras informações relevantes para o sistema. 
    Os métodos fornecidos permitem criar novas visualizações, recuperar visualizações específicas ou 
    todas as visualizações do usuário autenticado, atualizar visualizações existentes e excluir visualizações 
    específicas. O controlador utiliza os modelos Visualizacao, Usuario e Agenda para interagir com o banco de 
    dados e realizar operações correspondentes.
*/

// Método para criar uma nova visualização
controller.create = async (req, res) => {
    req.body.usuario_id = req.authUser.id; // Adiciona o id do usuário autenticado ao corpo da requisição

    try {

        const existingVisualizacao = await Visualizacao.findOne({
            where: { agenda_id: req.body.agenda_id } // Filtra pelo id do jogo

        })
        if (existingVisualizacao){
            return res.status(409).send("Já existe um registro de visualização para esta agenda.");
        }
        await Visualizacao.create(req.body); // Cria uma nova visualização no banco de dados
        // HTTP 201: Created
        res.status(201).end(); // Retorna status 201 indicando que a visualização foi criada com sucesso
    } catch(error) {
        console.error(error); // Log de erros
    }
}

// Método para recuperar todas as visualizações do usuário autenticado
controller.retrieve = async (req, res) => {
    try {
        const data = await Visualizacao.findAll({
            include: [
                {model: Usuario, as: 'usuario'}, // Inclui informações do usuário associado à visualização
                {model: Agenda, as: 'agenda'},   // Inclui informações da agenda associada à visualização
            ],
            where: { usuario_id: req.authUser.id } // Filtra apenas as visualizações do usuário autenticado
        });
        res.send(data); // Retorna os dados das visualizações
    } catch(error) {
        console.error(error); // Log de erros
    }
}

// Método para recuperar uma visualização específica do usuário autenticado
controller.retrieveOne = async (req, res) => {
    try {
        const data = await Visualizacao.findOne({
            where: { id: req.params.id, usuario_id: req.authUser.id }, // Filtra pela ID e pelo usuário autenticado
            include: [
                {model: Usuario, as: 'usuario'}, // Inclui informações do usuário associado à visualização
                {model: Agenda, as: 'agenda'},   // Inclui informações da agenda associada à visualização
            ],
        });
        if (data) res.send(data); // Se a visualização existe, retorna os dados
        else res.status(404).end(); // Se não encontrou a visualização, retorna status 404: Not Found
    } catch (error) {
        console.error(error); // Log de erros
    }
};

// Método para atualizar uma visualização específica do usuário autenticado
controller.update = async (req, res) => {
    try {
        const existingRecord = await Visualizacao.findOne({
            where: { agenda_id: req.body.agenda_id } // Filtra pelo id do jogo

        });
        // Se já existe um registro associado a este jogo, retorna um erro 409 Conflict
        if (existingRecord && existingRecord.id !== req.params.id) {
            return res.status(409).json({ error: 'Já existe um registro de visualização para este jogo.' });
        }

        const response = await Visualizacao.update(
            req.body,
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela ID e pelo usuário autenticado
        );
        // response retorna um vetor. O primeiro elemento do vetor indica quantos registros foram afetados pelo update
        if(response[0] > 0) {
            // HTTP 204: No content
            res.status(204).end(); // Retorna status 204 indicando que a visualização foi atualizada com sucesso
        } else {
            // Não encontrou o registro para atualizar ~> HTTP 404: Not Found
            res.status(404).end();
        }
    } catch (error) {
        console.error(error); // Log de erros
    }
}

// Método para deletar uma visualização específica do usuário autenticado
controller.delete = async (req, res) => {
    try {
        const response = await Visualizacao.destroy(
            { where: { id: req.params.id, usuario_id: req.authUser.id } } // Filtra pela ID e pelo usuário autenticado
        );
        if(response) {
            // Encontrou e excluiu ~> HTTP 204: No content
            res.status(204).end();
        } else {
            // Não encontrou e não excluiu ~> HTTP 404: Not Found
            res.status(404).end();
        }
    } catch (error) {
        console.error(error); // Log de erros
    }
}

module.exports = controller; // Exporta o controlador para ser utilizado em outras partes do código
