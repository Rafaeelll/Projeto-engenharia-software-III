import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '../../components/ui/PageTitle';
import Button  from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Box from '@mui/material/Box';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';


export default function Agendas() {
  return (
    <> 
      <PageTitle title="Selecione uma das opções abaixo:"/>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "25px"
      }}>
        <Link to="/criar_agenda">
          <Button style={{marginRight: '20px'}}
          variant="contained"
          size="large"
          color="secondary"
          startIcon={<AddCircleIcon/>}
          >
          Criar agenda
          </Button>
        </Link>

        <Link to="/verificar_agenda">
          <Button style={{marginRight: '20px'}}
          variant="contained"
          size="large"
          color="secondary"
          startIcon={<ContentPasteSearchIcon/>}
          >
          Verificar agendas
          </Button>
        </Link>
      </Box>
    </>
  )
}
