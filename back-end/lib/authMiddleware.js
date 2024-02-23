// Este middleware realiza as seguintes ações:

// Obtém o token de autenticação dos cookies da requisição.
// Verifica se o token não está presente. Se estiver ausente, responde com status 401 (Unauthorized) e indica que a autenticação falhou.
// Verifica e decodifica o token JWT usando a chave secreta definida em process.env.TOKEN_SECRET.
// Se houver um erro ao verificar ou decodificar o token, responde com status 403 (Forbidden) e indica que a autenticação falhou.
// Se o token for verificado com sucesso, os dados do usuário decodificado são armazenados no objeto req.user para uso posterior.
// Avança para o próximo middleware na cadeia.

const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para lidar com tokens JWT

// Função middleware para autenticação de token
const authenticateToken = (req, res, next) => {
  // Obtém o token de autenticação dos cookies da requisição
  const token = req.cookies.AUTH;

  // Verifica se o token não está presente
  if (token == null) {
    // Se o token estiver ausente, retorna status 401 (Unauthorized) e indica que a autenticação falhou
    return res.status(401).json({ auth: false });
  }

  // Verifica e decodifica o token JWT
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // Se houver um erro ao verificar ou decodificar o token
    if (err) {
      // Retorna status 403 (Forbidden) indicando que a autenticação falhou
      return res.status(403).json({ auth: false });
    }

    // Se o token for verificado com sucesso, os dados do usuário decodificado são armazenados no objeto req para uso posterior
    req.user = user;

    // Avança para o próximo middleware na cadeia
    next();
  });
};

module.exports = authenticateToken; // Exporta a função middleware de autenticação de token
