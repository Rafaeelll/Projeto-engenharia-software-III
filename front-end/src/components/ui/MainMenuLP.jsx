import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import InfoIcon from '@mui/icons-material/Info';
import Typography  from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


export default function MainMenuLP() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (
    <div>
      <BootstrapTooltip title="Menu">
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon/>
        </IconButton>
      </BootstrapTooltip>
     
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem 
          onClick={handleClose} 
          component={Link} to="/"
          style={{
            backgroundColor: location.pathname === '/' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/' ? 'white' : 'purple',
          }}    
          >
          <IconButton 
            size='small'
            color='inherit'
          >
            <HomeIcon/>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Home </Typography>
        </MenuItem>
        
        <Divider/>

        <MenuItem 
          onClick={handleClose} 
          component={Link} to="/sobre"
          style={{
            backgroundColor: location.pathname === '/sobre' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/sobre' ? 'white' : 'black',
          }}
          >
          <IconButton 
            color='inherit'
            size='small'
          >
            <InfoIcon/>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Sobre </Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={handleClose} 
          component={Link} to="/contato"
          style={{
            backgroundColor: location.pathname === '/contato' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/contato' ? 'white' : 'black',
          }}
          >
          <IconButton
            color='inherit'
            size='small'          
          >
            <ContactsIcon/>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Sobre </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}