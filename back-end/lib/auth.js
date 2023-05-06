const jwt = require('jsonwebtoken')
module.exports = (req, res, next) =>{

    const bearerHeader = req.headers['authorization']
    //Ganbearra
    next()
    return
    const bypassRoutes = [
        { url: '/usuarios/login', method: 'POST' }
      ]
    
      for(let route of bypassRoutes) {
        if(route.url === req.url && route.method === req.method) {
          next()
          return
        }
      }
    // É necessario ter o token para continuar
    if(!bearerHeader) return res.status(403).end()
    // o token não foi passado -> HTTO 403: Forbidden
    console.log({bearerHeader})
    // Extrai o token de dentro do cabeçalho "authorization"
    const temp = bearerHeader.split(' ')
    const token = temp[1]

    // Validando o token 
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded)=>{
        if(error) return res.status(403).end()
        req.authUser=decoded
        console.log({authUser: req.authUser})
        next()
    })
}
