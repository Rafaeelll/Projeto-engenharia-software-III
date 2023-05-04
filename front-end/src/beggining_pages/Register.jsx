import React from 'react'
import ImagemFundo from '../assets/back.jpg'
import StreamAdvisor from '../assets/sa.png'
import {useState} from 'react'
import '../styles.css'



function Register(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [sobrenome, setSobreNome] = useState("")
    return(
        <div className="container">
        <div className="container-login" style={{ backgroundImage: `url(${ImagemFundo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'monospace'}}>
          <div className="wrap-login">
            <form className="login-form">
                <span className="login-form-title" style={{fontFamily: 'monospace'}}>Cadastrar-se</span>
                <span className="login-form-title">
                  <img src={StreamAdvisor} alt="Stream Advisor"/>
                </span>

                <div className="wrap-input">
                <input 
                  className={name !== "" ? 'has-val input': 'input'}
                  type="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Nome"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={sobrenome !== "" ? 'has-val input': 'input'}
                  type="email"
                  value={sobrenome}
                  onChange={e => setSobreNome(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Sobrenome"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={email !== "" ? 'has-val input': 'input'}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Email"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={password !== "" ? 'has-val input': 'input'}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span className="focus-input" data-placeholder="Senha"></span>
                </div>

              <div className="container-login-form-btn">
                <button className="login-form-btn">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
    </div>
    )
}
export default Register