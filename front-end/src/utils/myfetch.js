const myfetch = {}  // Objeto vazio

// Lê o endereço do back-end a partir do arquivo .env.local
const baseUrl = import.meta.env.VITE_BACKEND_URI

function defaultOptions(body = null, method = 'GET') {
  const options = {
    method,
    headers: {"Content-type": "application/json; charset=UTF-8"},
    credentials: 'include'
  }

  if(body) options.body = JSON.stringify(body)

  // Verifica se existe um token gravado no localStorage e o inclui
  // nos headers, nesse caso
  const token = window.localStorage.getItem('token')

  if(token) options.headers.Authentication = `Bearer ${token}`

  return options
}

function getErrorDescription(response) {
  switch(response.status) {
    case 401:   // Unauthorized
      return 'ERRO: usuário ou senha incorretos!'

    case 404: // Not found
      return 'ERRO: ID não foi encontrado!'
    case 409: // 
      return 'Já existe uma agenda nesse intervalo de tempo!'
    case 410: // 
      return 'Você já possui um jogo com esse nome!'
    case 411: // 
      return 'A agenda informada não foi finalizada ainda!'
    case 412: // 
      return 'Já existe um registro de visualização para esta agenda!'
    case 418: // 
      return 'Já existe um registro de histórico para este jogo!'
    case 422: // 
      return 'Para agendas com mais de 3 horas, é obrigatório informar o horário de início e fim da pausa.'

    default:
      return `HTTP ${response.status}: ${response.statusText}`
  }
}

myfetch.post = async function(path, body) {
  const response = await fetch(baseUrl + path, defaultOptions(body, 'POST'))
  if(response.ok) return true
  else throw new Error(getErrorDescription(response))
}

myfetch.put = async function(path, body) {
  const response = await fetch(baseUrl + path, defaultOptions(body, 'PUT'))
  if(response.ok) return true
  else throw new Error(getErrorDescription(response))
}

myfetch.get = async function(path) {
  const response = await fetch(baseUrl + path, defaultOptions())
  if(response.ok) return response.json()
  else throw new Error(getErrorDescription(response))
}

myfetch.delete = async function(path) {
  const response = await fetch(baseUrl + path, defaultOptions(null, 'DELETE'))
  if(response.ok) return true   // Não retorna json()
  else throw new Error(getErrorDescription(response))
}

export default myfetch