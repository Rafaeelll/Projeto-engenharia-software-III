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
import ConfirmDialogGreeting  from '../../components/ui/ConfirmDialogGretting'
import myfetch from '../../utils/myfetch';



export default function PaginaInicial() {
  const API_PATH_US = '/usuarios';
  const [userAccessCount, setUserAccessCount] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogInteracted, setDialogInteracted] = React.useState(false); // Novo estado para controlar se o usuário já interagiu com o diálogo

  const handleShowDialog = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_US}`);
      if (result) {
        const contagemResult = result.map(usuario =>({
          nome: usuario.nome,
          contagem_acesso: usuario.contagem_acesso
        }));
        setUserAccessCount(contagemResult);
        const firstAccessCount = contagemResult[0]?.contagem_acesso || 0;
        if (firstAccessCount === 1 && !dialogInteracted) { // Verifica se o usuário ainda não interagiu com o diálogo
          setShowDialog(true);
        } else {
          setShowDialog(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  React.useEffect(() => {
    handleShowDialog();
  }, []);

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogInteracted(true); // Define que o usuário interagiu com o diálogo
  };

  return (
    <>
      <ConfirmDialogGreeting
        open={showDialog}
        onClose={handleCloseDialog}
        title="Stream Advisor"
        greetings={
          <Typography>
            Olá, {userAccessCount.map((userAccessCountItem) => (
              userAccessCountItem.nome
            ))}
          </Typography>
        }
      >
      </ConfirmDialogGreeting>
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