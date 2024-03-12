import React from "react";
import { Link } from "react-router-dom";
import StreamAdvisor from '../../assets/sa2.png';

function Contact(){
    return (
        <div className="container-landing-page" 
            style={{ backgroundSize: "cover", backgroundPosition: "center", height: "100vh", display: "flex", justifyContent: "center", alignItems: 'flex-start'
            }}>
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
            <div style={{marginTop: "200px", marginRight: '1000px'}} className="body-text2">
                <h1 style={{ fontFamily: "monospace", color: "white", fontSize: "40px", fontWeight: 'bold'}}> 
                    <u>Contatos</u>
                </h1>
                <div style={{ display: "flex", flexDirection: "column" }}>
                        <p1 className = "contact-whatsapp"style={{fontFamily: 'monospace', fontSize: '20px', color: 'white', width: '280px', marginTop: '10px'}}> 
                        WhatsApp: (16) 99412-6700
                        </p1>
                    <Link to="https://www.instagram.com/young_abnel/?next=%2F" target="_blank" rel="noopener noreferrer">
                        <a className="contact-insta" style={{ fontFamily: "monospace", width: '30px', fontSize: '20px', color: 'lightblue', marginTop: "10px" }}>
                            <u>Instagram</u>
                        </a>
                    </Link>

                    <Link to="https://www.rafaelabnelcintra@gmail.com" target="_blank" rel="noopener noreferrer">
                        <a className="contact-email" style={{ fontFamily: "monospace", width: '30px', fontSize: '20px', color: 'lightblue', marginTop: "10px" }}>
                            <u>Email</u>
                        </a>
                    </Link>

                    <Link to="https://github.com/Rafaeelll" target="_blank" rel="noopener noreferrer">
                        <a className="contact-git" style={{ fontFamily: "monospace", width: '30px', fontSize: '20px', color: 'lightblue', marginTop: "10px"}}>
                            <u>Github</u>
                        </a>
                    </Link>
                </div>
            </div>        
        </div>
  );
}
export default Contact