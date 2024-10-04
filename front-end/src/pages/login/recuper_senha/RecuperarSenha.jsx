import React from 'react'
import StreamAdvisorLogo from '../../../assets/sa4.png'
import ImagemFundo from '../../../assets/back.jpg'
import './styles/recuperar_senha.css'
import { Link, useNavigate } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../../components/ui/Notification'
import myfetch from '../../../utils/myfetch'
import Button  from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import  Tooltip, {tooltipClasses} from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'


export default function RecuperarSenha() {

  const [email, setEmail] = React.useState("")
  const [token, setToken] = React.useState("")
  const [senha_acesso, setSenhaAcesso] = React.useState("")
  const [mostrarSenha, setMostrarSenha] = React.useState(false)

  const [showWaiting, setShowWaiting] = React.useState(false)
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success' // ou 'error'
    }) 

    const navigate = useNavigate()
    const API_PATH = '/usuarios/recuperar_senha'

    const handleClickShowPassword = () => {
      setMostrarSenha(!mostrarSenha)
    }
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault()
    }

    async function handleSubmit(event) {
      event.preventDefault()      // Impede o recarregamento da página
      setShowWaiting(true)        // Mostra o spinner de espera
      try {
        const result = await myfetch.post(`${API_PATH}`, {email, token, senha_acesso})
        if (result) {
          // Exibe o snackbar de sucesso
          setNotif({
              show: true,
              message: 'Sua senha foi recuperada com sucesso!',
              severity: 'success'
          })        
          setTimeout(()=>{
              navigate('/login')
          }, 3500)
        }
      }
      catch(error) {
        console.error(error)
  
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

    const BootstrapTooltip = styled(({ className, ...props }) => (
      <Tooltip placement="bottom-end" {...props} arrow classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        },
      }));

  return (
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

      <AppBar position='static' className='app-bar'>
        <Toolbar>
        <BootstrapTooltip title="Voltar" >
          <IconButton onClick={()=> {navigate(-1)}}
          sx={{backgroundColor: 'black'}}>
          <ArrowBackIcon fontSize='medium' sx={{color: 'whitesmoke', fontWeight: 'bold'}}/>
          </IconButton>
        </BootstrapTooltip>
        </Toolbar>
      </AppBar>

        <div className="container-login"
          style={{ 
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
              <span className="login-form-title" 
                style={{fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '15px'}}>
                  Recuperar minha senha
              </span>
                <span className="login-form-title">
                  <img src={StreamAdvisorLogo} alt="Stream Advisor"/>
                </span>

                <div className="wrap-input2">
                  <TextField
                    className='input2'
                    label='E-mail'
                    variant='filled'
                    type="name"
                    name='email'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div> 

                <div className="wrap-input2">
                  <TextField
                    className='input2'
                    label='Token'
                    variant='filled'
                    type="text"
                    name='passwordResetToken'
                    required
                    value={token}
                    onChange={e => setToken(e.target.value)}
                  />
                </div> 

                <div className="wrap-input2">
                <TextField
                  className='input2'
                  color='secondary'
                  label="Nova Senha"
                  variant='filled'
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha_acesso}
                  onChange={e => setSenhaAcesso(e.target.value)}
                  InputProps={{
                    endAdornment: 
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }}
                />
              </div>

                <div className="container-login-form-btn">
                  <Button type='submit'
                    sx={{ 
                    color: 'inherit', 
                    fontFamily: 'monospace', 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    }} 
                  className="login-form-btn"> Avançar </Button>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}
