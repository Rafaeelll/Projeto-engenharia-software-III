import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/Games';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import Badge from '@mui/material/Badge';
import myfetch from '../../utils/myfetch';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


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

  const API_PATH = '/notificacoes/contagem';
  const API_PATH2 = '/notificacoes/atualizar_contagem_notificacoes';
  const [notificacoes, setNotificacoes] = React.useState(0);

  async function fetchData(){
    try{
      const response  = await myfetch.get(API_PATH);
      const result = response;
      setNotificacoes(result);
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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

  async function handleBadgeNotifClick(event){
    try{
      const response = await myfetch.put(`${API_PATH2}`)
      const result = response;
      setNotificacoes(result)
      fetchData();
    }
    catch (error){
      console.error('Erro ao atualizar a contagem de notificações:', error);
    }
}

  
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
          component={Link} to="/pagina_inicial"
          style={{
            backgroundColor: location.pathname === '/pagina_inicial' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/pagina_inicial' ? 'white' : 'purple'}}>
          <IconButton    
            size='small'
            color='inherit'
          >
            <HomeIcon/>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Página Inicial</Typography>

        </MenuItem>
        
        <Divider />

        <MenuItem 
          onClick={handleClose} 
          component={Link} to="/agenda"
          style={{
            backgroundColor:
            location.pathname === '/agenda/new' || location.pathname === '/agenda' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/agenda/new' || location.pathname === '/agenda' ? 'white' : 'black',
          }}>
          <IconButton 
            color='inherit'
            size='small'
          >
            <EventNoteIcon/> 
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Agendas</Typography>
        </MenuItem>

        <Accordion style={{width:'100%', margin: '0 auto'}}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography> Jogos/Históricos </Typography>
          </AccordionSummary>
          <AccordionDetails>

            <MenuItem 
              onClick={handleClose} 
              component={Link} to="/jogo"
              style={{
                backgroundColor: location.pathname === '/jogo' || 
                location.pathname === '/jogo/new' ||
                location.pathname === '/jogo/:id' ? '#21d4fd' : 'transparent',
                color: location.pathname === '/jogo' || 
                location.pathname === '/jogo/new' ||
                location.pathname === '/jogo/:id' ? 'white' : 'black',
              }}
              >
              <IconButton 
                color='inherit'
                size='small'
              >
                <GamesIcon/>
              </IconButton>
              <Typography style={{marginLeft: '5px'}}> Jogos </Typography>
            </MenuItem>

            <MenuItem 
              onClick={handleClose} 
              component={Link} to="/historico_jogo"
              style={{
                backgroundColor: location.pathname === '/historico_jogo' || 
                location.pathname === '/historico_jogo/new' ||
                location.pathname === '/historico_jogo/:id' ? '#21d4fd' : 'transparent',
                color: location.pathname === '/historico_jogo' || 
                location.pathname === '/historico_jogo/new' ||
                location.pathname === '/historico_jogo/:id' ? 'white' : 'black'}}>
              <IconButton 
                color='inherit'
                size='small'
              >
               <HistoryIcon/>
              </IconButton>
              <Typography style={{marginLeft: '5px'}}> Histórico de Jogos </Typography> 
            </MenuItem>
          </AccordionDetails>
        </Accordion>

        <MenuItem 
          onClick={handleClose} 
          component={Link} to="/visualizacao"
          style={{
            backgroundColor: location.pathname === '/visualizacao' || 
            location.pathname === '/visualizacao/new' ||
            location.pathname === '/visualizacao/:id' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/visualizacao' || 
            location.pathname === '/visualizacao/new' ||
            location.pathname === '/visualizacao/:id'? 'white' : 'black',
          }}>
          <IconButton 
            color='inherit'
            size='small'
          >
            <VisibilityIcon/>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Visualizações </Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={handleClose}
          component={Link} to="/perfil"
          style={{
            backgroundColor: location.pathname === '/perfil' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/perfil' ? 'white' : 'black',
          }}>
          <IconButton
            color='inherit'
            size='small'
          >
            <AccountCircleSharpIcon/> 
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Perfil </Typography>
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            handleClose(); // Primeira função
            handleBadgeNotifClick(event); // Segunda função
          }}           
          component={Link} to="/notificacao"
          style={{
            backgroundColor: location.pathname === '/notificacao' ? '#21d4fd' : 'transparent',
            color: location.pathname === '/notificacao' ? 'white' : 'black',
          }}>
          <IconButton
            color='inherit'
            size='small'
            onClick={handleBadgeNotifClick}
          >
            <Badge badgeContent={notificacoes.count} color="error" max={99}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <NotificationsIcon/> 
            </Badge>
          </IconButton>
          <Typography style={{marginLeft: '5px'}}> Notificações </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}