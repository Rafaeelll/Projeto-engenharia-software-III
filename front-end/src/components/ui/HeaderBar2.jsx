import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import sa2 from '../../../src/assets/sa2.png'
import { Link, useLocation } from 'react-router-dom'
import '../../pages/home/styles/home-styles.css'
import Button from '@mui/material/Button';

export default function HeaderBar2() {

  const location = useLocation();

  // backgroundColor: location.pathname === '/pagina_inicial' ? '#21d4fd' : 'transparent',
  // color: location.pathname === '/pagina_inicial' ? 'white' : 'purple',
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Box>
            <img className="logotipo" src={sa2} alt='Stream Advisor logo' />
          </Box>
            <Typography style={{margin: '20px', fontSize: "12px"}} className="header-author-name"> Desenvolvido por: <strong>Rafael Felipe</strong> </Typography>
            <div className='header-bar-links'>
              <Link className="home-btn" to="/"> 
                <Button 
                  style={{background: location.pathname == "/" ? '#b721ff': 'transparent', 
                  fontWeight: location.pathname == "/" ? 'bold': 'normal', 
                  color: '#f5deff', 
                  borderRadius: '20px'
                  }}> Home
                </Button>
              </Link>
              <Link className="login-btn"to="/login">
                <Button style={{color: '#f5deff', borderRadius: '20px'}}> 
                  Login 
                </Button>
              </Link>
              <Link className="sobre-btn"to="/sobre">
                <Button style={{background: location.pathname == "/sobre" ? '#b721ff': 'transparent', 
                  fontWeight: location.pathname == "/sobre" ? 'bold': 'normal', 
                  color: '#f5deff', 
                  borderRadius: '20px'}}> Sobre
                </Button>
              </Link>
              <Link className="contato-btn"to="/contato">
                <Button style={{background: location.pathname == "/contato" ? '#b721ff': 'transparent', 
                  fontWeight: location.pathname == "/contato" ? 'bold': 'normal', 
                  color: '#f5deff', 
                  borderRadius: '20px'}}> Contato
                </Button>
              </Link>
            </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}