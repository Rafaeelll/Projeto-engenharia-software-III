import StreamAdvisor from '../assets/sa.png'
import React from 'react'
import '../styles.css'
import ImagemFundo from '../assets/back.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../components/ui/Notification'
import myfetch from '../utils/myfetch'
import  Button  from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login';


export default function LoginForm({onLoginLogout}) {
  const [email, setEmail] = React.useState("")
  const [senha_acesso, setSenhaAcesso] = React.useState("")
  const [showWaiting, setShowWaiting] = React.useState(false)
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success' // ou 'error'
  })
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()      // Impede o recarregamento da página
    setShowWaiting(true)        // Mostra o spinner de espera
    try {

      const result = await myfetch.post('/usuarios/login', { email, senha_acesso})

      window.localStorage.setItem('token', result.token)

      // Exibe o snackbar de sucesso
      setNotif({
        show: true,
        message: 'Autenticação realizada com sucesso!',
        severity: 'success'
      })
      onLoginLogout(true)
      navigate('/pagina_inicial')

    }
    catch(error) {
      console.error(error)

      // Apaga o token de autenticação no localStorage, caso exista
      window.localStorage.removeItem('token')  

      // Exibe o snackbar de erro
      setNotif({
        show: true,
        message: error.message,
        severity: 'error'
      })
    }
    finally {
      setShowWaiting(false)   // Esconde o spinner de espera
    }
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ show: false })
  };



  return(
    <div className="container">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <Notification 
        show={notif.show} 
        onClose={handleNotifClose}
        severity={notif.severity}
      >
        {notif.message}
      </Notification>
        <div className="container-login"style={{ 
          backgroundImage: `url(${ImagemFundo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'monospace'
          }}>
          <div className="wrap-login">
            <form onSubmit={handleSubmit}className="login-form">
                <span className="login-form-title" style={{fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '15px'}}>Autentique-se</span>
                <span className="login-form-title">
                  <img src={StreamAdvisor} alt="Stream Advisor"/>
                </span>

              <div className="wrap-input">
                <input 
                  className={email !== "" ? 'has-val input': 'input'}
                  type="email"
                  value={email}
                  required
                  onChange={e => setEmail(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Email"></span>
              </div>

              <div className="wrap-input">
                <input 
                  className={senha_acesso !== "" ? 'has-val input': 'input'}
                  type="password"
                  required
                  value={senha_acesso}
                  onChange={e => setSenhaAcesso(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Senha"></span>
              </div>

              <div className="container-login-form-btn">
                <Button type='submit'
                sx={{ 
                  color: 'inherit', 
                  fontFamily: 'monospace', 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  }} 
                  className="login-form-btn">Entrar {<LoginIcon sx={{margin: '5px'}}/>} </Button>
              </div>
              
              <div className="text-center">
                <span className="txt1">Não possui conta?</span>
                <Link className ="txt2" to="/cadastro"><p><u>Criar conta</u></p></Link>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

