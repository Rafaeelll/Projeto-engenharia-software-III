const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Importe o modelo de usuário, se necessário

module.exports = (req, res, next) => {
  const bypassRoutes = [
    { url: '/usuarios/login', method: 'POST' },
    { url: '/usuarios', method: 'POST' },
    { url: '/usuarios/cadastro', method: 'POST' },
  ];

  for (let route of bypassRoutes) {
    if (route.url === req.url && route.method === req.method) {
      next();
      return;
    }
  }

  const token = req.cookies['AUTH'];

  if (!token) return res.status(403).end();

  jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
    if (error) return res.status(403).end();

    try {
      const usuario = await Usuario.findOne({ where: { id: decoded.id } });

      if (!usuario) return res.status(403).end();

      // Se o token for válido, armazene as informações do usuário no objeto req para uso posterior
      req.authUser = usuario;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).end(); // Em caso de erro, responda com erro interno do servidor
    }
  });
};
