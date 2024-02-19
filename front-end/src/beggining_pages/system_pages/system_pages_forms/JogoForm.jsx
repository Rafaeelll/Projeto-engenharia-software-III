import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import '../../../styles/styles.css'
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import Jogo from '../../../../models/Jogo'
import Paper from '@mui/material/Paper'
import Typography  from '@mui/material/Typography';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';



export default function jogos() {
  const API_PATH = '/jogos';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    jogos: {
      nome: '',
      usuario_id: '',
      data_jogo: '',
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { jogos, errors, showWaiting, notif } = state;
  
  function handleFormFieldChange(event) {
    const jogosCopy = {...jogos}
    jogosCopy[event.target.name] = event.target.value
    setState({...state, jogos: jogosCopy})
  }

  
  function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData();
  }
    React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(params.id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, showWaiting: true, errors:{}})
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`)
      setState({
        ...state,
        jogos: result,
        showWaiting: false
      })
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
    setState({...state, showWaiting: true, errors: {}})
    try {
        // Chama a validação da biblioteca Joi
        await Jogo.validateAsync(jogos, { abortEarly: false })

        // Registro já existe: chama PUT para atualizar
        if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, jogos)
        
        // Registro não existe: chama POST para criar
        else await myfetch.post(API_PATH, jogos)

        setState({
            ...state, 
            showWaiting: false,
            notif: {
                severity: 'success',
                show: true,
                message: 'Item salvo com sucesso'
            }
        })
    }
    catch(error) {
        const { validationError, errorMessages } = getValidationMessages(error)

        console.error(error)
        
        if (error.response && error.response.status === 400) {
            // Erro de validação personalizado
            setState({
                ...state, 
                showWaiting: false,
                errors: { nome: error.response.data.error }, // Defina o erro de validação para o campo 'nome'
                notif: {
                    severity: 'error',
                    show: true,
                    message: error.response.data.error // Exiba a mensagem de erro personalizada
                }
            })
        } else {
            // Outro erro interno do servidor
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
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        justifyContent: 'center',
        background: 'whitesmokesss'
      }}
      className="pai"
    >
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
        className="Jogo-container"
        sx={{
          width: '512px',
          background: 'whitesmoke',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '12px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title={params.id ? "Editar Jogo" : "Cadastrar jogos"} 
        /> 
        <Typography variant="h5" component="div">
        <form onSubmit={handleFormSubmit}>
            <TextField sx={{marginTop: '12px'}}
              id="standard-basic"
              color='secondary'
              label="Nome"
              variant='filled'
              type="name"
              required
              fullWidth
              name="nome"
              value={jogos.nome}
              onChange={handleFormFieldChange}
              error={errors?.nome}
              helperText={errors?.nome}
            />
            <TextField sx={{marginTop: '12px'}}
                label="Id usuario (Este campo é preenchido automaticamente)"
                type="number"
                variant='filled'
                fullWidth
                required
                name="usuario_id"
                value={jogos.usuario_id}
                onChange={handleFormFieldChange}
                error={errors?.usuario_id}
                helperText={errors?.usuario_id}
                disabled

              />

            <TextField sx={{marginTop: '12px'}}
              required
              variant='filled'
              label='Data de aquisição'
              type="date"
              name="data_jogo"
              fullWidth
              value={jogos.data_jogo}
              onChange={handleFormFieldChange}
            />
          
          <div className='jogo-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              sx={{
                margin: '10px',
                padding: '5px 15px 5px 15px',
                border: 'none',
                background: 'black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              color="secondary"
              variant='contained'
              type="submit"
            > 
              Salvar
            </Button>
            <Button
              sx={{
                margin: '10px',
                padding: '5px 15px 5px 15px',
                border: 'none',
                background: 'black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              color="error"
              variant='contained'
              onClick={() => navigate('/jogo')}
            >
              Cancelar
            </Button>
          </div>         
        </form>
        </Typography>
      </Paper>
    </div>
  );
}