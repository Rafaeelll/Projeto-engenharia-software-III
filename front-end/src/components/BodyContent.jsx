import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';

const images = [
  {
    url: '/src/assets/gamer.jpg',
    title: 'Bem vindo ao Stream Advisor!',
    subtitle: 'Sistema de agendas e monitoramento voltada a gamers,' +
    ' com objetividade de melhorar o seu desempenho e produtividade no ramo profissional de gamer-streamer.',
    buttontitle: 'Cadastrar-se',
    width: '100%',
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 550, // Aumentando a altura da imagem
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 200,
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
    '& .button-title':{
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.4)',
      backgroundColor: '#b721ff',
      transition: 'box-shadow 0.5s ease',
      borderRadius: '10px',
      border: 'none',
      fontWeight: 'bold',
      width: '100%'
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

const Title = styled(Typography)({
  fontSize: '2.5rem',
  textAlign: 'center',
  margin: '20px',
});
const SubTitle = styled(Typography)({
  fontSize: '1.1rem',
  textAlign: 'center',
  margin: '20px',
  width: '650px'
  
});

const ButtonTitle = styled(ButtonBase)(({theme})=>({
  fontSize: '1.5rem', // Ajustando o tamanho da fonte para o título do botão
  color: theme.palette.common.white,
  transition: theme.transitions.create('opacity')
}))





export default function BodyContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {images.map((image) => (
        <ImageButton
          focusRipple
          key={image.title}
          style={{
            width: image.width,
          }}
        >
          <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
          <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Title
                component="span"
                sx={{
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
                >
                <strong><u>{image.title}</u></strong>
                <SubTitle className='sub-title'>
                  {image.subtitle}
                </SubTitle>
                <Link to="/cadastro">
                  <ButtonTitle
                    className='button-title'
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                  {image.buttontitle} 
                    <ImageMarked className="MuiImageMarked-root" />
                  </ButtonTitle>
                </Link>
              </Title>
            </Image>
          </ImageButton>
      ))}
    </Box>
  );
}
