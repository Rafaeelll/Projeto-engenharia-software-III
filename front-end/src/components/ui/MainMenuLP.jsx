import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Button  from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { MdContactMail } from "react-icons/md";
import { FcAbout } from "react-icons/fc";



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

  return (
    <div>
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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/">
          <Button style={{
            fontFamily: 'monospace', 
            backgroundColor: location.pathname === '/' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/' ? 'white' : 'purple',
          }}    
            color='secondary'
            startIcon={<HomeIcon/>}
          >
            Home
          </Button>
        </MenuItem>
        
        <Divider/>

        <MenuItem onClick={handleClose} component={Link} to="/sobre">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/sobre' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/sobre' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<FcAbout/>

          }
          >
            Sobre
          </Button>
        </MenuItem>
        
        <MenuItem onClick={handleClose} component={Link} to="/contato">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/contato' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/contato' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<MdContactMail/>
          }
          >
            Contato
          </Button>
        </MenuItem>
      </Menu>
    </div>
  );
}