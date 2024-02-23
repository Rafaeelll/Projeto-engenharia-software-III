// Este middleware realiza as seguintes ações:

// Verifica se o usuário autenticado está tentando acessar seus próprios dados.
// Se o parâmetro id estiver presente na requisição e o id do usuário autenticado 
// não corresponder ao id fornecido na requisição, responde com status 403 (Forbidden) e indica que o acesso não está autorizado.
// Avança para o próximo middleware na cadeia se a verificação de autorização for bem-sucedida.

// Middleware de autorização
const authorizationMiddleware = (req, res, next) => {
  // Verifica se o usuário autenticado está tentando acessar seus próprios dados
  if (req.params.id && req.authUser.id !== parseInt(req.params.id)) {
    // Se o usuário autenticado não estiver acessando seus próprios dados, retorna status 403 (Forbidden)
    // e indica que o acesso não está autorizado
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  // Avança para o próximo middleware na cadeia
  next();
};

module.exports = authorizationMiddleware; // Exporta o middleware de autorização
