// Este middleware realiza as seguintes ações:

// Verifica se o usuário autenticado está tentando acessar seus próprios dados.
// Se o parâmetro id estiver presente na requisição e o id do usuário autenticado 
// não corresponder ao id fornecido na requisição, responde com status 403 (Forbidden) e indica que o acesso não está autorizado.
// Avança para o próximo middleware na cadeia se a verificação de autorização for bem-sucedida.

// Middleware de autorização

module.exports = (req, res, next) => {
    // Verifique se o usuário autenticado está tentando acessar seus próprios dados
    if (req.params.id && req.authUser.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    next();
  };