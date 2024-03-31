import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';
import './styles/main-pages-styles.css'
import CollapsibleTableJogo from '../../components/ui/CollapsibleTableJogo';


  export default function Jogos() {

    return(
      <>
      
        <CollapsibleTableJogo/>

        <Box sx={{display: "flex",justifyContent: "center", marginTop: "25px"}}>
          <Link to="new">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Novo Jogo
            </Button>
          </Link>

          <Link to="/historico_jogo">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<HistoryIcon/>}
            >
              Históricos De Jogos
            </Button>
          </Link>
        </Box>
      </>
    )
  }
