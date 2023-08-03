const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const bypassRoutes = [
    { url: '/usuarios/login', method: 'POST' },
    { url: '/usuarios/cadastro', method: 'POST' },

    // Adicione outras rotas que devem ser ignoradas aqui, se necessário
  ];

  for (let route of bypassRoutes) {
    if (route.url === req.url && route.method === req.method) {
      next();
      return;
    }
  }

  // Verifica se o token foi enviado por meio de cookie
  const token = req.cookies['AUTH'];

  // Se não houver token ~> HTTP 403: Forbidden
  if (!token) return res.status(403).end();

  // Validando o token
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    // Token inválido ou expirado ~> HTTP 403: Forbidden
    if (error) return res.status(403).end();

    // Se chegamos até aqui, o token está OK e temos as informações do
    // usuário logado no parâmetro "decoded". Vamos guardar isso na
    // request para usar depois
    req.authUser = decoded;

    next();
  });
};
