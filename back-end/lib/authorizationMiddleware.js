const authorizationMiddleware = (req, res, next) => {
    // Verifique se o usuário autenticado está tentando acessar seus próprios dados
    if (req.params.id && req.authUser.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
  
    next();
  };
  
  module.exports = authorizationMiddleware;
  