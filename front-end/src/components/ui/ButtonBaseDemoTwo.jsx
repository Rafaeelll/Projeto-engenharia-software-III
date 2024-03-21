import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ConfirmDialogInitialPage from './ConfirmDialogInitialPage';

const images = [
  {
    id: 4,
    url: '/src/assets/historicobutton.jpg',
    title: 'Histórico De Jogos',
    width: '20%',
    instruction1: `Neste item o sistema permitirá o usúario à registrar, editar, visualizar e excluir históricos de jogos salvos no sistema.
    Os históricos estão associados aos jogos e tem o objetivo de armazenar a progressão do usuário em um jogo, além disso 
    poderá avaliar o jogo e fazer comentários sobre os jogos.`, 
    warningTitle: 'Atenção:',
    warning1: `Crie pelo menos um jogo antes de realizar esta função.`,
    warning2: `O sistema não permitirá confirmar que zerou jogos de categorias: "MOBA", "MMORPG" e "Battle Royale".`,
    warning3: `O sistema só permitirá informar o nível que esta no jogo se o usuário confirmar que já inícou a gameplay.`,
    acessarInstrucao: 'Para criar um histórico clique no botão "Acessar" logo abaixo.',
    route: '/historico_jogo/new'
  },
  {
    id: 5,
    url: 'https://c4.wallpaperflare.com/wallpaper/658/253/180/girl-headphones-computer-face-girl-hd-wallpaper-preview.jpg',
    title: 'Notificações',
    width: '20%',
    instruction1: `Neste item o sistema irá criar notificações automaticamente e permitirá o usuário à editar, listar e excluir suas notificações.
    As notificações estão associadas às agendas e tem o objetivo de armazenar e notificar os usuários sobre a inicialização, finalização, pausa 
    estratégica, confirmação de sua presença e confirmação da finalização da agenda. 
    Além de ser notificado pela plataforma o usuário será notificado pelo navegador.`, 
    warningTitle: 'Atenção:',
    warning1: `Por padrão, o sistema notificará sobre o início da agenda com uma hora de antecedência.`,
    warning2: `Após confirmar a finalização da agenda, orientamos registrar o número de visualização da agenda/transmissão.`,
    warning3: `O sistema irá permitir que o usuário configure a notificação, incluindo opções como:
    Configurar quando receberá a notificação de início ou fim da agenda, seja quando a agenda começar e finalizar, 30 minutos antes ou, por padrão, 1 hora antes.
    Configurar a confirmação da presença da agenda automaticamente.`,
    acessarInstrucao: 'Para verificar as notificações clique no botão "Acessar" logo abaixo.',
    route: '/notificacao'
  },
  {
    id: 6,
    url: '/src/assets/perfilbutton.jpg',
    title: 'Perfil',
    width: '20%',
    instruction1: 'Conteúdo relacionado às visualizações...',
    route: '/perfil'
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

export default function ButtonBaseDemoTwo() {
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    showDialog: false,
    dialogTitle: '',
    dialogInstruction1: '',
    dialogWarningTitle: '',
    dialogWarning1: '',
    dialogWarning2: '',
    dialogWarning3: '',
    dialogInstructionAcessar: '',
    targetRoute: '',
  });

  const { 
    showDialog, 
    dialogTitle,
    dialogInstruction1, 
    dialogWarningTitle,
    dialogWarning1, 
    dialogWarning2,
    dialogWarning3,
    dialogInstructionAcessar, 
    targetRoute } = state;

  function handleDialogClose(event, reason, answer) {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, showDialog: false });
    if(answer){
      setState({ ...state, showDialog: false })
    }
  }

  function handleImageClick(title, instruction1, warningTitle, warning1, warning2, warning3,acessarInstrucao, route) {
    setState({
      ...state,
      dialogTitle: title,
      dialogInstruction1: instruction1,
      dialogWarningTitle: warningTitle,
      dialogWarning1: warning1,
      dialogWarning2: warning2,
      dialogWarning3: warning3,
      dialogInstructionAcessar: acessarInstrucao,
      targetRoute: route,
      showDialog: true,
    });
  }

  return (
    <>
      <ConfirmDialogInitialPage
         open={showDialog}
         title={dialogTitle}
         instruction1={dialogInstruction1}
         warningTitle={dialogWarningTitle}
         warning1={dialogWarning1}
         warning2={dialogWarning2}
         warning3={dialogWarning3}
         acessarInstrucao={dialogInstructionAcessar}
         onClose={handleDialogClose}
         onConfirm={() => {
           navigate(targetRoute);
           setState({ ...state, showDialog: false });
         }}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          minWidth: 300,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {images.map((image) => (
          <ImageButton
            focusRipple
            key={image.title}
            style={{
              width: image.width,
            }}
            onClick={() =>
              handleImageClick(image.title, 
                image.instruction1, 
                image.warningTitle, 
                image.warning1,
                image.warning2, 
                image.warning3, 
                image.acessarInstrucao, 
                image.route)
            }
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: 'relative',
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        ))}
      </Box>
    </>
  );
}
