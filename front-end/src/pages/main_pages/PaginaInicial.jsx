import React from 'react';
import ButtonBaseDemo from '../../components/ui/ButtonBaseDemo';
import ButtonBaseDemoTwo from '../../components/ui/ButtonBaseDemoTwo';
import './styles/main-pages-styles.css';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import ConfirmDialogGreeting from '../../components/ui/ConfirmDialogGretting';
import myfetch from '../../utils/myfetch';
import api from '../../../services/api'
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PaginaInicial() {
  const API_PATH_US = '/usuarios';
  const API_PATH_NF_PUSH = '/notificacoes/push/public_key';
  const API_PATH_NF_SAVE = '/notificacoes/push/register';


  const [userInfo, setUserInfo] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const serviceWorker = await navigator.serviceWorker.register('service-worker.js');
      let subscription = await serviceWorker.pushManager.getSubscription();
      
      if (!subscription) {
        const publicKeyResponse = await api.get(API_PATH_NF_PUSH);
        
        // Verifique se a chave pública é nula
        if (publicKeyResponse.publicKey === null) {
          console.log('Usuário ainda não tem uma chave pública, registrando...');
  
          // Continue o processo de inscrição
          subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.VITE_VAPID_KEY
          });
  
          // Enviar inscrição ao back-end
          await api.post(API_PATH_NF_SAVE, { subscription });
        }
      }
    }
  };
  

  const handleShowDialog = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_US}`);
      if (result) {
        const user = result.map(usuario => ({
          nome: usuario.nome,
          contagem_acesso: usuario.contagem_acesso,
          firstLogin: usuario.firstLogin
        }));
        setUserInfo(user);

        const firstAccessCount = user[0]?.contagem_acesso || 0;
        const isFirstLogin = user[0]?.firstLogin;

        // Verifica se o diálogo já foi exibido nesta sessão
        const dialogShown = localStorage.getItem('dialogShown') === 'true';

        if (firstAccessCount === 1 && isFirstLogin === true && !dialogShown) {
          setShowDialog(true);
        } else {
          setShowDialog(false);
        }
      }

      // Após verificar o login, registre o service worker e cheque a permissão de notificação
      await registerServiceWorker();
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    handleShowDialog();
  }, []);

  const handleCloseDialog = () => {
    // Quando o usuário fechar o diálogo, marque como exibido
    localStorage.setItem('dialogShown', 'true');
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
            Agradecemos ter você como membro! <FavoriteIcon fontSize='small' color='error' />
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
