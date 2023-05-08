import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import MainMenu from './MainMenu'
import sa3 from '../../assets/sa3.png'

export default function HeaderBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className='app-bar'>
        <Toolbar>
          <MainMenu/>
          <Typography style={{fontFamily: 'monospace'}} variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
            <img style={{height: '50px'}} src={sa3} alt='Stream Advisor logo' />
        </Toolbar>
      </AppBar>
    </Box>
  );
}