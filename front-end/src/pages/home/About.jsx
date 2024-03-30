import React from "react";
import HeaderBarLP from "../../components/ui/HeaderBarLP";
import './styles/home-styles.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import SteamAdvisorLogo from '../../assets/agendabutton.jpg'
import FooterContent from "../../components/FooterContent";


function About(){
  return (
    <>
      <HeaderBarLP/>

      <Card sx={{width: '100%', borderRadius: '0px 0px 0px 0px'}}>
        <CardMedia 
          style={{
            backgroundImage: `url(${SteamAdvisorLogo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center', 
            height: '350px'
          }}/>
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            <u><strong>Stream Advisor</strong></u>
          </Typography>
          <Typography gutterBottom variant="h6" component="div" color="text.secondary">
            <strong>Questão Problema:</strong> Excessividade no uso da tecnologia de vídeo games por gamers-streamers.
          </Typography>
          <Typography variant="body2" color="text.secondary">
              O projeto proposto para a solução tem como objetivo de prevenir ou minimizar que os gamers-streamers use com 
            excessividade o seu tempo em transmissões jogando, criando um sistema para controlar melhor seu tempo e ainda 
            ser produtivo. Diante disso, será criado um sistema web para fazer essa função. Nessa plataforma o usuário terá 
            um sistema de agenda que interage com ele notificando e auxiliando como usar melhor seu tempo jogando nas suas 
            transmissões. Projeto sendo desenvolvido no 5° semestre do curso ADS - Fatec Franca na materia de engenharia 
            de software III do professor Fernando no qual solicitou que nos alunos, desenvolvêssemos um sistema com pelo menos
            3 CRUDS.
          </Typography>
        </CardContent>
      </Card>
    </>

  );
}
export default About