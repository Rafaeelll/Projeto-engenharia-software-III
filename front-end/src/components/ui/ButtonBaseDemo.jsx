import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ConfirmDialogInitialPage from './ConfirmDialogInitialPage';

const images = [
  {
    id: 1,
    url: '/src/assets/jogosbutton.jpg',
    title: 'Jogos',
    width: '20%',
    instruction1: 'Neste item o sistema permitirá o usúario à registrar, editar, listar e excluir seus jogos favoritos.',
    warningTitle: 'Atenção:',
    warning1: `Crie pelo menos um jogo antes de realizar outras funções do sistema.`,
    warning2: `O sistema não permitirá criar jogos com o mesmo nome.`,
    warning3: `Caso desejar excluir um jogo e o ID deste estiver registrado em outros itens como 
    (Histórico de jogos e Agendas) os dados destes itens tambem serão excluídos.`,
    acessarInstrucao: 'Para criar clique no botão "Acessar" logo abaixo.',
    route: '/jogo/new'
  },
  {
    id: 2,
    url: '/src/assets/agendabutton.jpg',
    title: 'Agendas',
    width: '20%',
    instruction1: `Neste item o sistema permitirá o usúario à registrar, editar, listar e excluir suas agendas.
    A agenda é umas das principais funções do sistema, seu objetivo é armazenar dados referentes as
    transmissões do usuário como data de início e término da agenda, horario de pausas etc.`,
    warningTitle: 'Atenção:',
    warning1: `Crie pelo menos um jogo antes de realizar esta função.`,
    warning2: `O sistema não permitirá criar agendas no mesmo intervalo de tempo. Para agendas com duração de 3 horas ou mais 
    o sistema exige que o usuário informe uma de pausa estratégica`,
    warning3: `Caso desejar excluir uma agenda e o ID deste estiver registrado em outros itens como o de 
    "Notificação e Visualização" os dados destes itens tambem serão excluídos.`,
    acessarInstrucao: 'Para criar clique no botão "Acessar" logo abaixo.',
    route: '/agenda/new'
  },
  {
    id: 3,
    url: '/src/assets/viewsbutton.jpg',
    title: 'Visualizações',
    width: '20%',
    instruction1: `Neste item o sistema permitirá o usúario à registrar, editar, listar e excluir suas visualizações. 
    As visualizações estão associadas as agendas e tem o objetivo de armazenar a quantidade de visualização 
    que a transmissão teve, depois que o usuário finalizar sua agenda.`,
    warningTitle: 'Atenção:',
    warning1: `Crie pelo menos uma agenda antes de realizar esta função.`,
    warning2: `O sistema só permitirá o registro de uma visualização se a agenda em que estiver associada estar com status "Finalizada."`,
    warning3: `O sistema orienta registrar a visualização toda vez em que o usuário for notificado sobre a finalização da agenda.`,
    acessarInstrucao: 'Para criar clique no botão "Acessar" logo abaixo.',
    route: '/visualizacao/new'
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

export default function ButtonBaseDemo() {
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
