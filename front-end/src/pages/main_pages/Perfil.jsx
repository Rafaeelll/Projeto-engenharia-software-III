import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom';
import './styles/main-pages-styles.css'
import CollapsibleTableUser from '../../components/ui/CollapsibleTableUser';


  export default function VerificarAgendas() {

    return(
      <>
      
        <CollapsibleTableUser/>

        <Box sx={{display: "flex",justifyContent: "center", marginTop: "15px"}}>
          <Link to="/cadastro">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Novo Usuário
            </Button>
          </Link>
        </Box>
      </>
    )
  }
