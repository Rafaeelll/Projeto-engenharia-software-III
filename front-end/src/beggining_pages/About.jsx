import React from "react";
import {Link} from 'react-router-dom'
import StreamAdvisor from '../assets/sa2.png';
import ImageSF from '../assets/SF.png'

function About(){
    return (
        <div className="container-landing-page" style={{ backgroundSize: "cover", backgroundPosition: "center", height: "100vh", display: "flex", justifyContent: "center" }}>
          <div className="logo" style={{ position: "absolute", top: -140, left: -120, height: "80px" }}>
            <img style={{ height: '100%' }} src={StreamAdvisor} alt="Logo" />
          </div>
            <h1 className="header-author-name" style={{ fontFamily: 'monospace', fontSize: '12px', color: 'white', fontWeight: 'lighter' }}>
              Desenvolvido por: <strong>Rafael Felipe Abnel Cintra</strong>
            </h1>
          <div className="header" style={{ alignSelf: "flex-start", marginLeft: "auto", marginTop: "10px" }} >
            <Link to="/">
              <a className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Home</a>
            </Link>
            <Link to="/login">
              <a className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Login</a>
            </Link>
            <Link to="/sobre">
              <a className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Sobre</a>
            </Link>
            <Link to="/contato">
              <a className="sobre-page" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Contatos</a>
            </Link>
          </div>
          <div className="body-text" style={{ alignSelf: "center", marginLeft: "20px", marginRight: "20px" }}>
            <h1 style={{ fontFamily: "monospace", color: "white", fontSize: "30px", fontWeight: 'bold', marginBottom:'20px'}}>Sobre o Projeto...</h1>
            <p1 style={{fontFamily: 'monospace', 
                fontSize: '20px', 
                textAlign: 'center', 
                alignSelf: "center",
                color: "whitesmoke",
                fontWeight: 'normal'
                }}> Questão Problema: Excessividade no uso da tecnologia de vídeo games por gamers-streamers.
            </p1>
            <p2 className="text-principal" style={{ fontFamily: "monospace", textAlign: "center", alignSelf: "center", width: '100%', fontSize: '16px'}}>
             O projeto proposto para a solução tem como objetivo de prevenir ou minimizar que os gamers-streamers use com 
            excessividade o seu tempo em transmissões jogando, criando um sistema para controlar melhor seu tempo e ainda 
            ser produtivo. Diante disso, será criado um sistema web para fazer essa função. Nessa plataforma o usuário terá 
            um sistema de agenda que interage com ele notificando e auxiliando como usar melhor seu tempo jogando nas suas 
            transmissões. Projeto sendo desenvolvido no 5° semestre do curso ADS - Fatec Franca na materia de engenharia 
            de software III do professor Fernando no qual solicitou que nos alunos, desenvolvêssemos um sistema com pelo menos
            3 CRUSD'S.
            </p2>
          </div>
          <img style={{ float: 'left', height: '300px', marginRight: '20px' }} src={ImageSF} alt="Imagem SF" />
        </div>
  );
}
export default About