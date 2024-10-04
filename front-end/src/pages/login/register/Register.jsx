import React from 'react'
import ImagemFundo from '../../../assets/back.jpg'
import StreamAdvisorLogo from '../../../assets/sa4.png'
import './styles/login-register-styles.css'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../../components/ui/Notification'
import {useNavigate, Link} from 'react-router-dom'
import Usuario from  '../../../../models/Usuario'
import getValidationMessages from '../../../utils/getValidationMessages'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import api from '../../../../services/api'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import ConfirmImgPreviewDialog from '../../../components/ui/ConfirmImgPreviewDialog'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


function Register(){

  const API_PATH = '/usuarios/cadastro'
  const navigate = useNavigate()
  const [selectedFileName, setSelectedFileName] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);

  
  const [state, setState] = React.useState({
    usuario: {
      nome: '',
      sobrenome: '',
      email: '',
      senha_acesso: '',
      confirmar_senha: '',
      telefone: '',
      image: ''
    },
    errors: {},
    showWaiting: false,
    mostrarSenha: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    },
    passwordChecks: {
      hasNumber: false,
      hasLetter: false,
      hasSymbol: false,
      isLengthValid: false
      
    }
  })
  const {
    usuario,
    mostrarSenha,
    errors,
    showWaiting,
    notif,
    passwordChecks
  } = state

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip placement="bottom-end" {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  const handleImagePreviewClick = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    setState({ ...state, usuario: { ...usuario, image: file } });
    setSelectedFile(URL.createObjectURL(file)); // Atualiza o URL da imagem
    setSelectedFileName(file.name); // Atualiza o nome do arquivo selecionado
  }

  function clearSelection() {
    setSelectedFile(null);
    setSelectedFileName('');
  }

  const handleClickShowPassword = () => setState({...state, mostrarSenha: !mostrarSenha})

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleFormFieldChange = (event) => {
    const { name, value } = event.target;

    if (name === 'senha_acesso') {
      // Verificar os requisitos de senha
      setState({
        ...state,
        passwordChecks: {
          hasNumber: /\d/.test(value),
          hasLetter: /[a-zA-Z]/.test(value),
          hasSymbol: /[^a-zA-Z0-9]/.test(value),
          isLengthValid: value.length >= 5 && value.length <= 10 // Verifica o comprimento

        },
        usuario: { ...usuario, [name]: value }
      });
    } else {
      let updatadedValue = value;
      // Atualiza o campo de telefone
      if (name === 'telefone') {
        const cleanedValue = value.replace(/\D/g, '');
        updatadedValue = cleanedValue.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      }
      setState({ ...state, usuario: { ...usuario, [name]: updatadedValue } });
    }
  };

function handleFormSubmit(event) {
  event.preventDefault()    // Evita que a página seja recarregada
  // Envia os dados para o back-end
  sendData()
}

async function sendData() {
  setState({ ...state, showWaiting: true, errors: {} });
  try {
    console.log('Dados a serem enviados:', usuario); // Adicione este console.log
    // Chama a validação da biblioteca Joi
    await Usuario.validateAsync(usuario, { abortEarly: false });

    const formData = new FormData()
    formData.append('nome', usuario.nome)
    formData.append('sobrenome', usuario.sobrenome)
    formData.append('email', usuario.email)
    formData.append('senha_acesso', usuario.senha_acesso)
    formData.append('telefone', usuario.telefone)
    formData.append('image', usuario.image)

    const headers = {
      'headers':{
        'Content-Type': 'multipart/form-data'
      }
    }
    await api.post(API_PATH, formData, headers)
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

    setState({
      ...state,
      showWaiting: false,
      errors: errorMessages,
      notif: {
        severity: 'error',
        show: !validationError,
        message: error.message,
      },
    });
  }
}

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    
    // Se o item foi salvo com sucesso, retorna à página de listagem
    if(notif.severity === 'success') navigate('/confirmar_cadastro')

    setState({ ...state, notif: { ...notif, show: false } })
  }


  return(  
    <div className="container">

      <ConfirmImgPreviewDialog
        open={showDialog}
        onClose={handleCloseDialog}
        title="Pré-Visualização"
        userName={<Typography> {usuario.nome + ' ' + usuario.sobrenome} </Typography>}
        profileImgPreview = { 
          <Avatar src={selectedFile} 
          alt="Foto de perfil" 
          style={{ width: '200px', height: '200px', boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.2)'}}/>}
      >
      </ConfirmImgPreviewDialog>

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

      <AppBar position='static' className='app-bar'>
        <Toolbar>
          <BootstrapTooltip title="Voltar para a página login" >
            <IconButton component={Link} to="/login"
            sx={{backgroundColor: 'black'}}>
              <ArrowBackIcon fontSize='medium' sx={{color: 'whitesmoke', fontWeight: 'bold'}}/>
            </IconButton>
          </BootstrapTooltip>
        </Toolbar>
      </AppBar>

    <div className="container-login" 
      style={{ 
        backgroundImage: `url(${ImagemFundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div className="wrap-register">
        <form onSubmit={handleFormSubmit} className="login-form">
          <span className="login-form-title" 
          style={{fontFamily: 'monospace', color: 'black', fontWeight: 'bold', marginBottom: '10px'}}>
            Cadastrar-se
          </span>
          <span className="login-form-title">
            <img src={StreamAdvisorLogo} alt="Stream Advisor"/>
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
              type="name"
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
              label='E-mail'
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
              type={mostrarSenha ? 'text' : 'password'}
              name='senha_acesso'
              required
              error={errors?.senha_acesso}
              helperText={errors?.senha_acesso}
              value={usuario.senha_acesso}
              onChange={handleFormFieldChange}
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }}
            />
          </div>

           {/* Indicadores visuais dos requisitos de senha */}
          <div className="wrap-input2">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              {passwordChecks.hasNumber ? (
                <CheckCircleIcon sx={{ fontSize: '16px', color: 'green', marginRight: '4px' }} />
              ) : (
                <CancelIcon sx={{ fontSize: '16px', color: 'red', marginRight: '4px' }} />
              )}
              <span>Pelo menos um número</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              {passwordChecks.hasLetter ? (
                <CheckCircleIcon sx={{ fontSize: '16px', color: 'green', marginRight: '4px' }} />
              ) : (
                <CancelIcon sx={{ fontSize: '16px', color: 'red', marginRight: '4px' }} />
              )}
              <span>Pelo menos uma letra</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {passwordChecks.hasSymbol ? (
                <CheckCircleIcon sx={{ fontSize: '16px', color: 'green', marginRight: '4px' }} />
              ) : (
                <CancelIcon sx={{ fontSize: '16px', color: 'red', marginRight: '4px' }} />
              )}
              <span>Pelo menos um símbolo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              {passwordChecks.isLengthValid ? (
                <CheckCircleIcon sx={{ fontSize: '16px', color: 'green', marginRight: '4px' }} />
              ) : (
                <CancelIcon sx={{ fontSize: '16px', color: 'red', marginRight: '4px' }} />
              )}
              <span>Entre 5 e 10 caracteres</span>
            </div>
          </div>

          <div className="wrap-input2">
            <TextField 
              label='Confirmar Senha'
              color='secondary'
              className='input2'
              variant='filled'
              type={mostrarSenha ? 'text' : 'password'}
              name='confirmar_senha'
              required
              error={errors?.confirmar_senha}
              helperText={errors?.confirmar_senha}
              value={usuario.confirmar_senha}
              onChange={handleFormFieldChange}
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }}
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

          <div className="wrap-input2">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              fullWidth
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              {selectedFile && 
                <IconButton onClick={handleImagePreviewClick}> 
                  <Avatar src={selectedFile} alt="Foto selecionada" sx={{ marginRight: '8px', width: '50px', height: '50px'}}/> 
                </IconButton>}
                {selectedFileName ? selectedFileName : <Typography variant='caption'> Clique aqui para adicionar uma foto de perfil caso desejar </Typography>}
                {selectedFile && <CloseIcon onClick={clearSelection} style={{ marginLeft: '8px', cursor: 'pointer' }} />}
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  name="image"
                />
              </Button>
          </div>

            <div className="container-login-form-btn">       
              <Button 
                sx={{fontFamily:'monospace',
                fontWeight:'bold', fontSize: '20px', color: '#fff'
              }}
                className="login-form-btn"
                type='submit'
                > Cadastrar {<HowToRegIcon sx={{m: '8px'}}/>}
              </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}
export default Register