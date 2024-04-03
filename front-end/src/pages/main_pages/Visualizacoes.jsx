import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom';
import './styles/main-pages-styles.css'
import CollapsibleTableVisualizacao from '../../components/ui/CollapsibleTableVisualizacao';


  export default function Visualizacoes() {

    return(
      <>
      
        <CollapsibleTableVisualizacao/>

        <Box sx={{display: "flex",justifyContent: "center", marginTop: "15px"}}>
          <Link to="new">
            <Button style={{marginRight: '15px'}}
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Nova Visualização
            </Button>
          </Link>
        </Box>
      </>
    )
  }
