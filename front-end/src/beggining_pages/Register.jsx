import React from 'react'
import ImagemFundo from '../assets/back.jpg'
import StreamAdvisor from '../assets/sa.png'
import '../styles.css'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../components/ui/Notification'
import {useNavigate} from 'react-router-dom'
import myfetch from '../utils/myfetch'
import Usuario from '../../models/usuario'
import getValidationMessages from '../utils/getValidationMessages'

function Register(){
  const API_PATH = '/usuarios'

  const navigate = useNavigate()

  const [state, setState] = React.useState({
    usuario: {
      nome: '',
      sobrenome: '',
      email: '',
      senha_acesso: '',
      telefone: ''
    },
    erros: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  })
  const {
    usuario,
    errors,
    showWaiting,
    notif
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
    setState({...state, showWaiting: true, errors: {}})
    try {

       // Chama a validação da biblioteca Joi
       await Usuario.validateAsync(usuario, { abortEarly: false })
      await myfetch.post(API_PATH, usuario)
      //DAR FEEDBACK POSITIVO
      setState({
        ...state, 
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Novo cadastro salvo com sucesso!'
        }
      })
    }
    catch(error) {
      const { validationError, errorMessages } = getValidationMessages(error)

      console.error(error)
      
      setState({
        ...state, 
        showWaiting: false,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: !validationError,
          message: 'ERRO: ' + error.message
        }
      })
    }
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    
    // Se o item foi salvo com sucesso, retorna à página de listagem
    if(notif.severity === 'success') navigate(-1)

    setState({ ...state, notif: { ...notif, show: false } })
  }
  return(  
      <div className="container">
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="secondary" />
          </Backdrop>

          <Notification 
            show={notif.show} 
            severity={notif.severity}
            onClose={handleNotifClose}
          >
            {notif.message}
          </Notification>

        <div className="container-login" style={{ 
          backgroundImage: `url(${ImagemFundo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'monospace'
        }}>
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
                  required
                  value={usuario.nome}
                  error={errors?.nome}
                  helperText={errors?.nome}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Nome"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="nome"
                  name='sobrenome'
                  required
                  error={errors?.sobrenome}
                  helperText={errors?.sobrenome}
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
                  required
                  value={usuario.email}
                  error={errors?.email}
                  helperText={errors?.email}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Email"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="password"
                  name='senha_acesso'
                  required
                  error={errors?.senha_acesso}
                  helperText={errors?.senha_acesso}
                  value={usuario.senha_acesso}
                  onChange={handleFormFieldChange}
                />
                <span className="focus-input" data-placeholder="Senha"></span>
                </div>

                <div className="wrap-input">
                <input 
                  className={usuario !== "" ? 'has-val input': 'input'}
                  type="phone"
                  required
                  name='telefone'
                  error={errors?.telefone}
                  helperText={errors?.telefone}
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