import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import GamesIcon from '@mui/icons-material/Games';
import { Link } from 'react-router-dom';
import './styles/main-pages-styles.css'
import CollapsibleTableHistorico from '../../components/ui/CollapsibleTableHistorico';

  export default function HistoricoJogos() {
  
    return (
      <>
        <CollapsibleTableHistorico/>
        
        <Box sx={{display: "flex", justifyContent: "center", marginTop: "15px"}}>
          <Link to="new">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Novo Histórico
            </Button>
          </Link>

          <Link to="/jogo">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<GamesIcon/>}
            >
              Jogos
            </Button>
          </Link>
        </Box>
      </>
    )
  }
