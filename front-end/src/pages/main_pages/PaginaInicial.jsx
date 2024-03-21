import React from 'react'
import ButtonBaseDemo from '../../components/ui/ButtonBaseDemo'
import ButtonBaseDemoTwo from '../../components/ui/ButtonBaseDemoTwo'
import './styles/main-pages-styles.css'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

export default function PaginaInicial() {


  return (
    <>
      <Box style={{padding: '15px'}}>
        <Accordion style={{width:'100%', margin: '0 auto', }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon  />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Instuções do Sistema:</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ButtonBaseDemo/>
            <ButtonBaseDemoTwo/>
          </AccordionDetails>
        </Accordion>
      </Box>  
    </>
  )
}