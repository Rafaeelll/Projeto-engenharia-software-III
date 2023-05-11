import React from 'react'
import ImagemFundo from '../assets/back.jpg'
import StreamAdvisor from '../assets/sa.png'
import '../styles.css'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import myfetch from '../utils/myfetch'

function Register(){
  const API_PATH = '/usuarios'

  const [state, setState] = React.useState({
    usuario: {}, // Objeto vazio
    showWaiting: false
  })
  const {
    usuario,
    showWaiting
  } = state

  function handleFormFieldChange(event) {
    const usuariosCopy = {...usuario}
    usuariosCopy[event.target.name] = event.target.value
    setState({...state, usuario: usuariosCopy})
  }

  function handleFormSubmit(event) {
    event.preventDefault()    // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData()
  }

  async function sendData() {
    setState({...state, showWaiting: true})
    try {
      await myfetch.post(API_PATH, usuario)
      // DAR FEEDBACK POSITIVO E VOLTAR PARA A LISTAGEM
      alert('Salvou!')
      setState({...state, showWaiting: false})
    }
    catch(error) {
      console.error(error)
      // DAR FEEDBACK NEGATIVO
      setState({...state, showWaiting: false})
    }
  }
  return(  
      <div className="container">
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
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
            <form onSubmit={handleFormSubmit} className="login-form">
                <span className="login-form-title" style={{fontFamily: 'monospace'}}>Cadastrar-se</span>
                <span className="login-form-title">
                  <img src={StreamAdvisor} alt="Stream Advisor"/>
                </span>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="name"
                  name='nome'
                  value={usuario.nome}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Nome"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="nome"
                  name='sobrenome'
                  value={usuario.sobrenome}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Sobrenome"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="email"
                  name='email'
                  value={usuario.email}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Email"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="password"
                  name='senha_acesso'
                  value={usuario.senha_acesso}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Senha"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="phone"
                  name='telefone'
                  value={usuario.telefone}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Telefone"></span>
                </div>

                <div className="container-login-form-btn">
                  <button 
                    className="login-form-btn"
                    type='submit'
                    >Cadastrar
                  </button>
              </div>
            </form>
          </div>
        </div>
    </div>
    )
}
export default Register