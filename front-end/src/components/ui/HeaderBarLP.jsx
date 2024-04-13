import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import sa2 from '../../../src/assets/sa2.png'
import { Link } from 'react-router-dom'
import '../../pages/home/styles/home-styles.css'
import Button from '@mui/material/Button';
import MainMenuLP from './MainMenuLP';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';


export default function HeaderBarLP({isLoggedIn, onLoginLogout}) {

  return (
    <Box>
      <AppBar position="static" className='app-bar' enableColorOnDark>
        <Toolbar>
          <MainMenuLP/>
          <Box sx={{ flexGrow: 1 }}>
            <img style={{width: '90px', borderRadius: '5px'}} src={sa2} alt='Stream Advisor logo' />
          </Box>

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