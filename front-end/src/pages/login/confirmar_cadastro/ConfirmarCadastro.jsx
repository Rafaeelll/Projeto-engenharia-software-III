import React from 'react'
import StreamAdvisorLogo from '../../../assets/sa4.png'
import ImagemFundo from '../../../assets/back.jpg'
import './styles/confirmar_cadastro.css'
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

export default function ConfirmarCadastro() {

    const [token, setToken] = React.useState("")
    const [showWaiting, setShowWaiting] = React.useState(false)
    const [notif, setNotif] = React.useState({
        show: false,
        message: '',
        severity: 'success' // ou 'error'
        }) 

    const navigate = useNavigate()
    const API_PATH = '/usuarios/confirmar_cadastro'

    async function handleSubmit(event) {
        event.preventDefault()      // Impede o recarregamento da página
        setShowWaiting(true)        // Mostra o spinner de espera
        try {
          const result = await myfetch.post(`${API_PATH}`, {token})
          if (result) {
            // Exibe o snackbar de sucesso
            setNotif({
                show: true,
                message: 'Seu cadastro foi confirmado com sucesso!',
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
                  Confirmação de Cadastro
              </span>
                <span className="login-form-title">
                  <img src={StreamAdvisorLogo} alt="Stream Advisor"/>
                </span>

                <div className="wrap-input2">
                  <TextField
                    className='input2'
                    label='Token'
                    variant='filled'
                    type="text"
                    name='confirmationToken'
                    required
                    value={token}
                    onChange={e => setToken(e.target.value)}
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
