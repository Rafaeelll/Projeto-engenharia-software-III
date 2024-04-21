import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActions } from '@mui/material';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    id: 1,
    label: 'Imagem 1',
    imgPath:
      'src/assets/sliderLP3.gif',
  },
  {
    id: 2,
    label: 'Imagem 2',
    imgPath:
      'src/assets/sliderLP.gif',
  },
  {
    id: 3,
    label: 'Imagem 3',
    imgPath:
    'src/assets/sliderLP2.gif'
  },
  {
    id: 4,
    label: 'Imagem 4',
    imgPath:
    'https://i.pinimg.com/originals/02/01/1e/02011ec8554277b8c70bf22fb192123c.gif'
  },

];

function SwipeableTextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  return (
    <Card className='background' sx={{borderRadius: '0px 0px 0px 0px', height: '100vh'}}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        interval={15000} // Intervalo de 15 segundos entre as mudanças de slide

        > 
          {images.map((step, index) => (
            <div key={step.id}>
              {Math.abs(activeStep - index) <= 2 ? (
                <CardMedia image={step.imgPath} alt={step.label}
                  style={{
                    height: 550,
                    display: 'block',
                    overflow: 'hidden',
                    width: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'}}>
                  <CardContent sx={{color: "white", textAlign: 'left', marginLeft: '20px', mt: 10, width: '55%'}}>
                    <Typography sx={{fontWeight: 'bolder', fontFamily: 'Verdana'}} 
                    gutterBottom variant="h4" component="div">
                      Bem Vindo ao StreamAdvisor!
                    </Typography> 
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      Sistema de agenda e monitoramento voltada a gamers, com a objetividade de melhorar o seu 
                      desempenho e produtividade no ramo profissional de gamer-streamer.
                    </Typography>

                    <CardActions style={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                      <Button className='cadastrar-se-LP-btn'
                        sx={{borderRadius: 40}}
                        component={Link} 
                        startIcon={<HowToRegIcon className='cadastrar-se-icon-btn'/>}
                        Cadastrar-se
                        to="/cadastro" 
                        color='secondary' 
                        variant='contained' 
                        size='large'
                      > 
                        Cadastrar-se
                      </Button>
                    </CardActions>
                  </CardContent>
                </CardMedia> 
              ) : null}
            </div>
          ))}
      </AutoPlaySwipeableViews>
      <MobileStepper sx={{background:'#2d2c2c'}}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            variant='outlined'
            color='info'
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Avançar
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button 
          variant='outlined' 
          size="small" 
          color='info'
          onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Voltar
          </Button>
        }
      />
    </Card>
  );
}

export default SwipeableTextMobileStepper;
