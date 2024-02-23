const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para lidar com tokens JWT


// Este middleware realiza as seguintes ações:
// Ignora rotas específicas que não exigem autenticação, como rotas para login e cadastro de usuários.
// Verifica se o token de autenticação JWT está presente nos cookies da requisição.
// Se o token estiver ausente, o middleware responde com o status HTTP 403 (Forbidden), indicando que o acesso é proibido.
// Se o token estiver presente, ele é validado usando a chave secreta definida em process.env.TOKEN_SECRET.
// Se o token for inválido ou expirado, o middleware responde com o status HTTP 403 (Forbidden).
// Se o token for válido, as informações do usuário decodificado são armazenadas no objeto req.authUser para uso posterior, e a execução passa para o próximo middleware na cadeia.

module.exports = (req, res, next) => {
  // Lista de rotas que devem ser ignoradas pelo middleware de autenticação
  const bypassRoutes = [
    { url: '/usuarios/login', method: 'POST' }, // Rota para login de usuários
    { url: '/usuarios', method: 'POST' }, // Rota para criar novos usuários
    { url: '/usuarios/cadastro', method: 'POST' }, // Rota para cadastrar novos usuários

    // Adicione outras rotas que devem ser ignoradas aqui, se necessário
  ];

  // Verifica se a rota atual está na lista de rotas ignoradas
  for (let route of bypassRoutes) {
    if (route.url === req.url && route.method === req.method) {
      next(); // Se a rota for encontrada, passa para o próximo middleware na cadeia
      return;
    }
  }

  // Verifica se o token de autenticação está presente nos cookies da requisição
  const token = req.cookies['AUTH'];

  // Se não houver token ~> HTTP 403: Forbidden
  if (!token) return res.status(403).end();

  // Validando o token JWT
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    // Se o token for inválido ou expirado ~> HTTP 403: Forbidden
    if (error) return res.status(403).end();

    // Se chegamos até aqui, o token está válido e decodificado contém as informações do usuário
    // logado. Essas informações são armazenadas no objeto req para uso posterior
    req.authUser = decoded;

    // Avança para o próximo middleware na cadeia
    next();
  });
};
