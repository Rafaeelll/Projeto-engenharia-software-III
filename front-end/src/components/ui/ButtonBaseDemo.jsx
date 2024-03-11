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
    instructions:  'Neste item o usúario poderá registrar, editar, visualizar e excluir seus jogos favoritos.', 
    warning: 'Crie pelo menos um jogo antes de realizar outras funções do sistema.',
    instructions2: 'Para criar clique no botão "Acessar" logo abaixo.',
    route: '/jogo'
  },
  {
    id: 2,
    url: '/src/assets/agendabutton.jpg',
    title: 'Agendas',
    width: '20%',
    instructions: 'Conteúdo relacionado às agendas...',
    route: '/agenda'
  },
  {
    id: 3,
    url: '/src/assets/viewsbutton.jpg',
    title: 'Visualizações',
    width: '20%',
    instructions: 'Conteúdo relacionado às visualizações...',
    route: '/visualizacao'
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
    dialogContent: '',
    dialogWarning: '',
    dialogContent2: '',
    targetRoute: '',
  });

  const { 
    showDialog, 
    dialogTitle,
    dialogContent, 
    dialogWarning, 
    dialogContent2, 
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

  function handleImageClick(title, instructions, warning, instructions2, route) {
    setState({
      ...state,
      dialogTitle: title,
      dialogContent: instructions,
      dialogWarning: warning,
      dialogContent2: instructions2,
      targetRoute: route,
      showDialog: true,
    });
  }

  return (
    <>
      <ConfirmDialogInitialPage
        open={showDialog}
        title={dialogTitle}
        instructions={dialogContent}
        warning={dialogWarning}
        instructions2={dialogContent2}
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
          paddingTop: '20px',
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
              handleImageClick(image.title, image.instructions, image.warning, image.instructions2, image.route)
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
