import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import MyAccount from '../../../../models/MyAccount';
import Paper  from '@mui/material/Paper';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';
import api from '../../../../services/api'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function MyAccountForm() {

  const API_PATH_US = '/usuarios'
  const API_PATH_MC =  '/usuarios/minha_conta'
  const { id } = useParams(); // Capturando o ID da URL
  const navigate = useNavigate()
  // const [showDialog, setShowDialog] = React.useState(false)

  const [state, setState] = React.useState({
    myAccountDatas: {
      email: '',
      senhaAtual: '',
      senha_acesso: '',
      confirmar_senha: '',
    },
    errors: {},
    mostrarSenha: false,
    showWaiting: false,
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
  });
  const { myAccountDatas, mostrarSenha, errors, showWaiting, notif, passwordChecks } = state;
  
  function handleFormFieldChange(event) {
    const {name, value} = event.target;
    if (name === 'senha_acesso') {
      setState({
        ...state,
        passwordChecks: {
          hasNumber: /\d/.test(value),
          hasLetter: /[a-zA-Z]/.test(value),
          hasSymbol: /[^a-zA-Z0-9]/.test(value),
          isLengthValid: value.length >= 5 && value.length <= 10
        },
        myAccountDatas: {...myAccountDatas, [name]: value}
      })
    }
  }

  const handleClickShowPassword = () => setState({...state, mostrarSenha: !mostrarSenha})

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData();
  }

  React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, showWaiting: true, errors:{}})
    try {
      // Verifica se params.id é definido antes de fazer a busca
      if (id) {
        const result = await api.get(`${API_PATH_US}/${id}`);
        setState({
          ...state,
          myAccountDatas: result,
          showWaiting: false
        });
      } else {
        console.error('ID da conta não foi definido.');
      }
    }
    catch(error) {
      console.error(error)
      setState({
        ...state, 
        showWaiting: false,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      })
    }
  }

  async function sendData() {
    setState({ ...state, showWaiting: true, errors: {} });
    try {
      console.log('Dados a serem enviados:', myAccountDatas); // Adicione este console.log

      await MyAccount.validateAsync(myAccountDatas, { abortEarly: false });
      if (id) {
        await api.put(`${API_PATH_MC}/${id}`, myAccountDatas);
  
      } else {
        await api.post(API_PATH_MC, myAccountDatas);
      }
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        }
      });
    } catch (error) {
      const { validationError, errorMessages } = getValidationMessages(error);
  
      console.error(error);
      // Erro de validação ou outro erro
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
    if (notif.severity === 'success') navigate(-1);
    setState({ ...state, notif: { ...notif, show: false } });
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress sx={{margin: '5px'}} color="secondary" />
        Por favor, aguarde.
      </Backdrop>

      <Notification show={notif.show} severity={notif.severity} onClose={handleNotifClose}>
        {notif.message}
      </Notification>

      <Paper
        className="Perfil-container"
        sx={{
          width: '512px',
          background: 'whitesmoke',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title="Editar Minha Conta"
        /> 
        <form onSubmit={handleFormSubmit}>
          <TextField
            id="standard-basic"
            label="E-mail"
            type="email"
            variant='filled'
            color='secondary'
            required
            fullWidth
            name="email"
            value={myAccountDatas.email}
            onChange={handleFormFieldChange}
            error={errors?.email}
            helperText={errors?.email}
            />

          <TextField sx={{marginTop: '15px'}}
            label="Informe a senha atual"
            type={mostrarSenha ? 'text' : 'password'}
            variant='filled'
            fullWidth
            required
            name="senhaAtual" // Nome do campo na tabela
            value={myAccountDatas.senhaAtual} // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.senhaAtual}
            helperText={errors?.senhaAtual}
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
          <Box sx={{mt: '10px'}}> 
            <Typography sx={{color: 'GrayText'}} variant='body6'> Esqueceu sua senha atual?</Typography> 
            <Link to={'/esqueci_senha'}> Clique aqui</Link>
          </Box>

          <TextField sx={{marginTop: '15px'}}
            label="Informe a nova senha"
            type={mostrarSenha ? 'text' : 'password'}
            variant='filled'
            fullWidth
            required
            name="senha_acesso" // Nome do campo na tabela
            value={myAccountDatas.senha_acesso} // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.senha_acesso}
            helperText={errors?.senha_acesso}
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
            <Box sx={{mt: '12px'}}>
            {/* Indicadores visuais dos requisitos de senha */}
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
            </Box>

            <TextField sx={{marginTop: '15px'}}
              label='Confirme a nova Senha'
              color='secondary'
              className='input2'
              variant='filled'
              type={mostrarSenha ? 'text' : 'password'}
              name='confirmar_senha'
              required
              error={errors?.confirmar_senha}
              helperText={errors?.confirmar_senha}
              value={myAccountDatas.confirmar_senha}
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

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              sx={{m: '10px', mt: '30px', background: 'black'}}
              color="secondary"
              variant='contained'
              type="submit"
            > 
              Salvar
            </Button>

            <Button
              sx={{m: '10px', mt: '30px', background: 'black'}}
              color="error"
              variant='contained'
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>       
        </form>
      </Paper>
    </>
  )
}
