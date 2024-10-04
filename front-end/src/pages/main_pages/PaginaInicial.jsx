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
import FavoriteIcon from '@mui/icons-material/Favorite';



  // React.useEffect(() => {
  //   const registerServiceWorker = async () => {
  //     if ('serviceWorker' in navigator) {
  //       const serviceWorker = await navigator.serviceWorker.register('service-worker.js');
  //       let subscription = await serviceWorker.pushManager.getSubscription();
  
  //       const API_PATH = '/notificacoes/push/public_key';
  //       const API_PATH2 = '/notificacoes/push/register';
  
  //       if (!subscription) {
  //         const publicKeyResponse = await myfetch.get(API_PATH);
  //         subscription = await serviceWorker.pushManager.subscribe({
  //           userVisibleOnly: true,
  //           applicationServerKey: publicKeyResponse.publicKey,
  //         });
  //       }
  
  //       await myfetch.post(API_PATH2, { subscription });
  //     }
  //   };
  
  //   registerServiceWorker();
  // }, []); // Dependência vazia para rodar apenas uma vez

  export default function PaginaInicial() {
    const API_PATH_US = '/usuarios';
    const [userInfo, setUserInfo] = React.useState([]);
    const [showDialog, setShowDialog] = React.useState(false);
  
    const handleShowDialog = async () => {
      try {
        const result = await myfetch.get(`${API_PATH_US}`);
        if (result) {
          const user = result.map(usuario => ({
            id: usuario.id, // Adiciona o ID do usuário para controle
            nome: usuario.nome,
            contagem_acesso: usuario.contagem_acesso,
            firstLogin: usuario.firstLogin
          }));
          setUserInfo(user);
  
          const firstAccessCount = user[0]?.contagem_acesso || 0;
          const isFirstLogin = user[0]?.firstLogin;
          const userId = user[0]?.id; // Pega o ID do usuário
  
          // Verifica se o diálogo já foi exibido para este usuário específico
          const dialogShownForUser = localStorage.getItem(`dialogShown_${userId}`) === 'true';
  
          if (firstAccessCount === 1 && isFirstLogin === true && !dialogShownForUser) {
            setShowDialog(true);
          } else {
            setShowDialog(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    React.useEffect(() => {
      handleShowDialog();
    }, []);
  
    const handleCloseDialog = () => {
      // Quando o usuário fechar o diálogo, marque como exibido para este usuário específico
      const userId = userInfo[0]?.id;
      localStorage.setItem(`dialogShown_${userId}`, 'true');
      setShowDialog(false);
    };
  
    return (
      <>
        <ConfirmDialogGreeting
          open={showDialog}
          onClose={handleCloseDialog}
          title="Bem Vindo"
          greetings={
            <Typography>
              Olá, {userInfo.map((userInfoItem) => userInfoItem.nome)}
              <br />
              <br />
              Antes de realizar as funções do sistema, orientamos a ver as instruções do sistema logo aqui na página inicial.
              <br />
              <br />
              Agradecemos ter você como membro! <FavoriteIcon fontSize='small' color='error'/>
            </Typography>
          }
        />
        <Box style={{ padding: '15px' }}>
          <Accordion style={{ width: '100%', margin: '0 auto' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
              <Typography>Instruções do Sistema:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonBaseDemo />
              <ButtonBaseDemoTwo />
            </AccordionDetails>
          </Accordion>
        </Box>
      </>
    );
  }
  