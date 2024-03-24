import * as React from 'react';
import './styles/home-styles.css'
import HeaderBarLP from '../../components/ui/HeaderBarLP';
import GamerBackground from '../../assets/back.jpg'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FooterContent from '../../components/FooterContent';
export default function LandingPage() {

  return (
    <>
    <div className="container">
      <HeaderBarLP/>
        <div className="container-landing-page"
          style={{ 
            backgroundImage: `url(${GamerBackground})`}}>
              <div className='wrap-body'>
                <div className='body-content'>
                  <span className='body-title'>
                    Stream Advisor!
                  </span>
                  <div className='body-text-center'>
                    <span className='body-text'>
                      Sistema de agenda e monitoramento voltada a gamers, 
                      com a objetividade de melhorar o seu desempenho e produtividade no ramo profissional de gamer-streamer.
                    </span>
                  </div>

                <div className="container-landing-page-btn">
                  <Button
                  sx={{ 
                    color: 'white', 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    }} 
                    className="landing-page-btn"
                    component={Link} to="/cadastro"> 
                    Cadastrar-se 
                    {<HowToRegIcon sx={{margin: '5px'}}/>} 
                  </Button>
                </div>
              </div>
            </div>
        </div>
        <FooterContent/>

    </div>

    </>
  );
}