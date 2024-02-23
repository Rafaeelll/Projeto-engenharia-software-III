/*
  Neste código, um roteador Express é definido para lidar com as solicitações HTTP na rota raiz '/'. 
  Quando uma solicitação GET é feita para a rota raiz, a função de retorno de chamada é executada. 
  Essa função renderiza a página index e passa o título 'Express' como um parâmetro para ser usado no template. 
  Por fim, o roteador é exportado para uso em outros arquivos.
*/

var express = require('express');
var router = express.Router();


// Define a rota GET para a página inicial
router.get('/', function(req, res, next) {
  // Renderiza a página index e passa o título 'Express' como parâmetro
  res.render('index', { title: 'Express' });
});

module.exports = router;