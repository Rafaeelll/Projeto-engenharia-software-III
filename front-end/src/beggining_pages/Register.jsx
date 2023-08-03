import React from 'react'
import ImagemFundo from '../assets/back.jpg'
import StreamAdvisor from '../assets/sa4.png'
import '../styles.css'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../components/ui/Notification'
import {useNavigate} from 'react-router-dom'
import myfetch from '../utils/myfetch'
import Usuario from '../../models/usuario'
import getValidationMessages from '../utils/getValidationMessages'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import HowToRegIcon from '@mui/icons-material/HowToReg';


function Register(){
  const API_PATH = '/usuarios/cadastro'

  const navigate = useNavigate()
  const [state, setState] = React.useState({
    usuario: {
      nome: '',
      sobrenome: '',
      email: '',
      senha_acesso: '',
      telefone: ''
    },
    errors: {},
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
    const { name, value } = event.target;
  
    let updatadedValue = value;
    if (name === 'telefone') {
    // Remove qualquer caractere que não seja dígito
    const cleanedValue = value.replace(/\D/g, '');
    // Formata o valor
    const formattedValue = cleanedValue.replace(
      /(\d{2})(\d{4,5})(\d{4})/,
      '($1) $2-$3'
    )
    updatadedValue = formattedValue
    }
    
    const usuariosCopy = {...usuario, [name]: updatadedValue};

    setState({...state, usuario: usuariosCopy})
} 
  

function handleFormSubmit(event) {
  event.preventDefault()    // Evita que a página seja recarregada
  // Envia os dados para o back-end
  sendData()
}

async function sendData() {
  setState({ ...state, showWaiting: true, errors: {} });
  try {
    // Chama a validação da biblioteca Joi
    await Usuario.validateAsync(usuario, { abortEarly: false });
    await myfetch.post(API_PATH, usuario);
    // DAR FEEDBACK POSITIVO
    setState({
      ...state,
      showWaiting: false,
      notif: {
        severity: 'success',
        show: true,
        message: 'Novo cadastro salvo com sucesso!',
      },
    });
  } catch (error) {
    const { validationError, errorMessages } = getValidationMessages(error);

    console.error(error);

    // Verifica se o erro é de conflito (status 409)
    if (error.response && error.response.status === 409) {
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
          message: 'O e-mail informado já está cadastrado.',
        },
      });
    } else {
      // Erro de validação ou outro erro
      setState({
        ...state,
        showWaiting: false,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: !validationError,
          message: 'ERRO: ' + error.message,
        },
      });
    }
  }
}



  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    
    // Se o item foi salvo com sucesso, retorna à página de listagem
    if(notif.severity === 'success') navigate('/login')

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
          <div className="wrap-register">
            <form onSubmit={handleFormSubmit} className="login-form">
                <span className="login-form-title" style={{fontFamily: 'monospace', color: 'black', fontWeight: 'bold', marginBottom: '10px'}}>Cadastrar-se</span>
                <span className="login-form-title">
                  <img src={StreamAdvisor} alt="Stream Advisor"/>
                </span>

                <div className="wrap-input2">
                <TextField 
                  className='input2'
                  label='Nome'
                  variant='filled'
                  type="name"
                  name='nome'
                  required
                  value={usuario.nome}
                  error={errors?.nome}
                  helperText={errors?.nome}
                  onChange={handleFormFieldChange}
                />
                </div>

                <div className="wrap-input2">
                <TextField 
                  label='Sobrenome'
                  color='secondary'
                  className='input2'
                  variant='filled'
                  type="nome"
                  name='sobrenome'
                  required
                  error={errors?.sobrenome}
                  helperText={errors?.sobrenome}
                  value={usuario.sobrenome}
                  onChange={handleFormFieldChange}
                />
                </div>

                <div className="wrap-input2">
                <TextField 
                  label='Email'
                  className='input2'
                  variant='filled'
                  type="email"
                  name='email'
                  required
                  value={usuario.email}
                  error={errors?.email}
                  helperText={errors?.email}
                  onChange={handleFormFieldChange}
                />
                </div>

                <div className="wrap-input2">
                <TextField 
                  label='Senha'
                  color='secondary'
                  className='input2'
                  variant='filled'
                  type="password"
                  name='senha_acesso'
                  required
                  error={errors?.senha_acesso}
                  helperText={errors?.senha_acesso}
                  value={usuario.senha_acesso}
                  onChange={handleFormFieldChange}
                />
                </div>

                <div className="wrap-input2">
                <TextField
                  className='input2'
                  variant='filled'
                  label='Telefone'
                  type="tel"
                  required
                  name='telefone'
                  error={errors?.telefone}
                  helperText={errors?.telefone}
                  value={usuario.telefone}
                  inputProps={{
                    maxLength: 15,
                    pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}',
                    onChange: handleFormFieldChange,
                  }}
                />
                </div>
                <div className="container-login-form-btn">
                  <Button 
                    sx={{fontFamily:'monospace',
                    fontWeight:'bold', fontSize: '20px'
                  }}
                    className="login-form-btn"
                    type='submit'
                    color='inherit'
                    >Cadastrar {<HowToRegIcon sx={{m: '8px'}}/>}
                  </Button>
              </div>
            </form>
          </div>
        </div>
    </div>
    )
}
export default Register