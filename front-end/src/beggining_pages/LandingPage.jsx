import * as React from 'react';
import { NavLink } from 'react-router-dom';
import gamerImage from '../assets/gamer.jpg';
import LogoTipo from '../assets/sa2.png';
import Typography  from '@mui/material/Typography';

export default function LandingPage() {

  return (
    <div className="container-landing-page" style={{ backgroundSize: "cover", backgroundPosition: "center", height: "100vh", display: "flex", justifyContent: "center" }}>
      <div className="logo" style={{ position: "absolute", top: -140, left: -120, height: "80px" }}>
        <img style={{ height: '100%' }} src={LogoTipo} alt="Logo" />
      </div>
      <Typography className="header-author-name" style={{ fontFamily: 'monospace', fontSize: '12px', color: 'white', fontWeight: 'lighter' }}>
        Desenvolvido por: <strong>Rafael Felipe Abnel Cintra</strong>
      </Typography>
      <div className="header" style={{ alignSelf: "flex-start", marginLeft: "auto", marginTop: "10px" }} >
        <NavLink to="/" className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Home</NavLink>
        <NavLink to="/login" className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Login</NavLink>
        <NavLink to="/sobre" className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Sobre</NavLink>
        <NavLink to="/contato" className="login-btm" style={{ padding: "10px", color: "white", fontWeight: "bold", fontFamily: "monospace", fontSize: '15px' }}>Contatos</NavLink>
      </div>

      <div className="body-text" style={{ alignSelf: "center", marginLeft: "20px", marginRight: "20px" }}>
        <h1 style={{ fontFamily: "monospace", color: "white", fontSize: "30px" }}>Bem vindo ao Stream Advisor!</h1>
        <p className="text-principal" style={{ fontFamily: "monospace", textAlign: "center", alignSelf: "center" }}>
          Sistema de agendas e monitoramento voltada a gamers, com objetividade de melhorar o seu desempenho e produtividade no ramo profissional de gamer-streamer.
        </p>
        <NavLink to="/cadastro">
          <button className="cadastrar-se-btm" style={{ padding: "20px 70px 20px 70px", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", fontFamily: "monospace" }}>Cadastrar-se</button>
        </NavLink>
      </div>

      <img style={{ float: 'right', height: '480px' }} src={gamerImage} alt="Gamer" />
    </div>
  );
}
