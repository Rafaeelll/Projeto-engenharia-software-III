import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Button  from '@mui/material/Button';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/Games';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';


export default function MainMenu() {
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
        <MenuItem onClick={handleClose} component={Link} to="/pagina_inicial">
          <Button style={{
            fontFamily: 'monospace', 
            backgroundColor: location.pathname === '/pagina_inicial' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/pagina_inicial' ? 'white' : 'purple',
          }}    
            color='secondary'
            startIcon={<HomeIcon/>}
          >
            Página inicial
          </Button>
        </MenuItem>
        
        <Divider />

        <MenuItem onClick={handleClose} component={Link} to="/agenda">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/agenda' || 
            location.pathname === '/criar_agenda' ||
            location.pathname === '/verificar_agenda' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/agenda' || 
            location.pathname === '/criar_agenda' ||
            location.pathname === '/verificar_agenda' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<EventNoteIcon/>}
          >
            Agendas
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose} component={Link} to="/jogo">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/jogo' || 
            location.pathname === '/jogo/new' ||
            location.pathname === '/jogo/:id' || 
            location.pathname === '/historico_jogo' || 
            location.pathname === '/historico_jogo/new' || 
            location.pathname === '/historico_jogo/:id' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/jogo' || 
            location.pathname === '/jogo/new' ||
            location.pathname === '/jogo/:id'|| 
            location.pathname === '/historico_jogo' || 
            location.pathname === '/historico_jogo/new' || 
            location.pathname === '/historico_jogo/:id'? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<GamesIcon/>}
          >
            Jogos
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose} component={Link} to="/visualizacao">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/visualizacao' || 
            location.pathname === '/visualizacao/new' ||
            location.pathname === '/visualizacao/:id' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/visualizacao' || 
            location.pathname === '/visualizacao/new' ||
            location.pathname === '/visualizacao/:id'? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<VisibilityIcon/>}
          >
            Visualizações
          </Button>
        </MenuItem>
        
        <MenuItem onClick={handleClose} component={Link} to="/perfil">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/perfil' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/perfil' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<AccountCircleSharpIcon/>}
          >
            Perfil
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose} component={Link} to="/configuracao">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/configuracao' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/configuracao' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<ManageAccountsIcon/>}
          >
            Configurações
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose} component={Link} to="/notificacao">
          <Button style={{fontFamily: 'monospace', 
            display: 'flex', justifyContent:'left', textAlign: 'left',
            backgroundColor: location.pathname === '/notificacao' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/notificacao' ? 'white' : 'black',
          }}
            color='inherit'
            fullWidth
            startIcon={<NotificationsIcon/>}
          >
            Notificações
          </Button>
        </MenuItem>
      </Menu>
    </div>
  );
}