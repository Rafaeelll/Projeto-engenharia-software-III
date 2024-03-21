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
import Joi from 'joi';

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
  const schema = Joi.number().integer().positive(); // Defina um esquema Joi para validar o ID


  const handleSearch = () => {
    const { error } = schema.validate(searchInput); // Valide o ID usando Joi
    if (error) {
      setSearchInput('ID não encontrado');
    } else {
      navigate(`/rota/${searchInput}`);
    }
  };

  const handleSearchClick = () => {
    setIsSelectVisible(true); // Ao clicar no componente de pesquisa, exibir o Select
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      <IconButton
        size="small"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={handleSearchClick} // Adicione um evento de clique para exibir o Select ao clicar no ícone de pesquisa
      >        
      </IconButton>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <StyledInputBase
          placeholder="Informe o ID:"
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
            inputProps={{ 'aria-label': 'select option' }}
            sx={{ ml: '8px', background: 'inherit', color: '#fff' }}
          >
            <MenuItem 
              value="" disabled>
              
              Pesquisar por:
            </MenuItem>
            <MenuItem value="Agendas"> ID Agendas</MenuItem>
            <MenuItem value="Jogos">ID Jogos</MenuItem>
            <MenuItem value="Historico de Jogos"> ID Histórico de Jogos</MenuItem>
            <MenuItem value="Visualizações">ID Visualizações</MenuItem>
            <MenuItem value="Notificações">ID Notificações</MenuItem>
          </Select>
        )}
        </Box>
          {searchInput === 'ID não encontrado' && (
          <div style={{ color: 'red', marginTop: '8px' }}>
            {searchInput}
          </div>
        )}
      </Search>
    </Box>
  );
}
