import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../ui/Notification'
import Tooltip from '@mui/material/Tooltip';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export default function SearchAppBar() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSelectVisible, setIsSelectVisible] = useState(false); // Estado para controlar a visibilidade do Select
  const [showWaiting, setShowWaiting] = React.useState(false)
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success' // ou 'error'
  })

  const handleSearch = async () => {
    if (selectedOption && searchInput) {
      setShowWaiting(true) 
      try {
        const response = await myfetch.get(`/${selectedOption.toLowerCase()}/${searchInput}`);
        if (response) {
          setNotif({
            show: true,
            message: 'Pesquisa realizada com sucesso',
            severity: 'success'
          })
          setTimeout(() => {
            navigate(`/resultado/${selectedOption.toLowerCase()}/${searchInput}`);
          }, 500);        
        }
      } 
      catch (error) {
        console.error('Erro ao buscar o ID:', error);
        setNotif({
          show: true,
          message: error.message,
          severity: 'error'
        })
      }
      finally {
        setShowWaiting(false)   // Esconde o spinner de espera
      }
    };
  }
  React.useEffect(() => {
    handleSearch()
  }, [])

  const handleSearchClick = () => {
    setIsSelectVisible(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
  
  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ show: false })
  };

  return (
    <>
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

        <Tooltip 
          title="Barra de Pesquisa: Pressione enter após selecionar o que deseja pesquisar e digitar o ID"
          placement="bottom-start"
          arrow>
          <Box sx={{ flexGrow: 1, marginBottom: '10px', marginLeft: '10px'}}>
            <IconButton
              size="small"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2}}
              onClick={handleSearchClick} // Adicione um evento de clique para exibir o Select ao clicar no ícone de pesquisa
            > 
            </IconButton>
      
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{cursor: 'pointer'}}/>
              </SearchIconWrapper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <StyledInputBase
                placeholder="Digite o ID..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress} // Adiciona o evento onKeyPress para detectar a tecla Enter
                onClick={ handleSearchClick} // Adicione um evento de clique para exibir o Select ao clicar na barra de pesquisa
              />
              {isSelectVisible && ( // Exibir o Select somente se isSelectVisible for true
                <Select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  displayEmpty
                  color='primary'
                  variant='outlined'
                  inputProps={{ 'aria-label': 'select option' }}
                  sx={{ ml: '8px', color: 'black', background: 'lightblue', borderRadius: '0px 5px 5px 0px', height: '40px'}}
                >
                  <MenuItem 
                    value="" disabled>
                    
                    Pesquisar por:
                  </MenuItem>
                  <MenuItem value="agendas"> ID Agendas</MenuItem>
                  <MenuItem value="jogos">ID Jogos</MenuItem>
                  <MenuItem value="historico_jogos"> ID Histórico de Jogos</MenuItem>
                  <MenuItem value="Visualizacoes">ID Visualizações</MenuItem>
                  <MenuItem value="notificacoes">ID Notificações</MenuItem>
                </Select>
              )}
              </Box>
            </Search>
          </Box>
        </Tooltip>

    </>

  );
}
