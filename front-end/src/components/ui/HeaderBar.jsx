import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu from './MainMenu'
import sa2 from '../../../src/assets/sa2.png'
import Backdrop  from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from './ConfirmDialog'
import myfetch from '../../utils/myfetch'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../pages/main_pages/styles/main-pages-styles.css'
import SearchAppBar from './SearchAppBar';

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

      <AppBar position='static' className='app-bar' enableColorOnDark>
        
        <Toolbar>
          <MainMenu/>
          <img style={{width: '90px', borderRadius: '5px'}} src={sa2} alt='Stream Advisor logo' />
          <SearchAppBar/>
          {
            !isLoggedIn && 
            <Button sx={{fontFamily: 'monospace', margin: '20px', background: 'black', fontWeight: 'bold'}}
              color="secondary"
              variant='contained'              
              startIcon={<LoginIcon style={{fontWeight: 'bold'}}/>}
              component={Link} to="/login">
              Entrar
            </Button>
          }
          {
            isLoggedIn && 
            <Button sx={{fontFamily: 'monospace', margin: '20px', background: 'black', fontWeight: 'bold'}}
              color="error"
              variant='contained'
              startIcon={<LogoutIcon style={{fontWeight: 'bold'}}/>}
              onClick={() => setState({...state, showDialog: true})}
            >
              Sair
            </Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}