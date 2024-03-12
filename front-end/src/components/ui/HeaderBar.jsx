import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainMenu from './MainMenu'
import sa3 from '../../../src/assets/sa3.png'
import Backdrop  from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from './ConfirmDialog'
import myfetch from '../../utils/myfetch'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export default function HeaderBar({isLoggedIn, onLoginLogout}) {
  const [state, setState] = React.useState({
    showDialog: false,
    showWaiting: false
  })
  const {
    showDialog,
    showWaiting
  } = state

  const navigate = useNavigate()

  async function handleDialogClose(answer) {
    if(answer) {
      setState({ ...state, showWaiting: true, showDialog: false })
      try {
        await myfetch.post('/usuarios/logout')
        onLoginLogout(false)
        navigate('/login')
      }
      catch(error) {
        console.error(error)
      }
      finally {
        setState({ ...state, showWaiting: false, showDialog: false })
      }
    }
    else setState({ ...state, showDialog: false })
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
       <ConfirmDialog 
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente encerrar a sessão?
      </ConfirmDialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <AppBar position="static" className='app-bar'>
        
        <Toolbar>
          <MainMenu/>
          <Typography style={{fontFamily: 'monospace'}} variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          {
            !isLoggedIn && 
            <Button 
              color="secondary" 
              startIcon={<LoginIcon/>}
              component={Link} to="/login">
              Entrar
            </Button>
          }
          {
            isLoggedIn && 
            <Button sx={{fontFamily: 'monospace', margin: '20px', background: 'black', fontWeight: 'bold'}}
              color="error"
              variant='contained'
              startIcon={<LogoutIcon/>}
              onClick={() => setState({...state, showDialog: true})}
            >
              Sair
            </Button>
          }
            <img style={{height: '50px'}} src={sa3} alt='Stream Advisor logo' />
        </Toolbar>
      </AppBar>
    </Box>
  );
}