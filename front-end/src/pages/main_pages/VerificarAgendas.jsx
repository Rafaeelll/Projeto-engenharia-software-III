import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom';
import './styles/main-pages-styles.css'
import CollapsibleTableAgenda from '../../components/ui/CollapsibleTableAgenda';


  export default function VerificarAgendas() {

    return(
      <>
      
        <CollapsibleTableAgenda/>

        <Box sx={{display: "flex",justifyContent: "center", marginTop: "15px"}}>
          <Link to="new">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Nova Agenda
            </Button>
          </Link>
        </Box>
      </>
    )
  }
