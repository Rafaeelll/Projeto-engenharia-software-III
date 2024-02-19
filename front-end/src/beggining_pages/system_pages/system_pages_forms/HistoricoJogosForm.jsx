import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import '../../../styles/styles.css'
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import HistoricoJogo from '../../../../models/HistoricoJogo'
import Paper from '@mui/material/Paper'
import Typography  from '@mui/material/Typography';
import FormTitle from '../../../components/ui/FormTitle';
import Button  from '@mui/material/Button';


export default function HistoricoJogosForm() {
  const API_PATH = '/historico_jogos';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    historicoJogos: {
      usuario_id: '',
      jogo_id: '',
      pontuacao: '',
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { historicoJogos, errors, showWaiting, notif } = state;
  
  
  function handleFormFieldChange(event) {
    const historicoJogosCopy = {...historicoJogos}
    historicoJogosCopy[event.target.name] = event.target.value
    setState({...state, historicoJogos: historicoJogosCopy})
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
        historicoJogos: result,
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
      
      const jogoExists = await verifyJogoExists(historicoJogos.jogo_id);
        if (!jogoExists) {
          setState({
            ...state,
            showWaiting: false,
            notif: {
              severity: 'error',
              show: true,
              message: 'ID do jogo não encontrado! Crie um jogo ou informe um ID válido.',
            },
          });
          return;
        }
      // Chama a validação da biblioteca Joi
      await HistoricoJogo.validateAsync(historicoJogos, { abortEarly: false })

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, historicoJogos)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, historicoJogos)

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
    async function verifyJogoExists(jogoId) {
      try {
        const result = await myfetch.get(`/jogos/${jogoId}`);
        return !!result; // Retorna true se o jogo for encontrado, senão retorna false
      } catch (error) {
        return false; // Retorna false em caso de erro
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
        className="HistoricoJogo-container"
        sx={{
          width: '512px',
          maxWidth: '90%',
          background: 'whitesmoke',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '12px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title={params.id ? "Editar Historico de Jogos" : "Criar histórico de jogos"} 
        /> 
        <Typography variant="h5" component="div">
        <form onSubmit={handleFormSubmit}>
          <div className='wrap-input3'>
            <TextField
              label="Id usuario (Este campo é preenchido automaticamente)"
              type="number"
              fullWidth
              variant='filled'
              required
              name="usuario_id" // Nome do campo na tabela
              value={historicoJogos.usuario_id} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.usuario_id}
              helperText={errors?.usuario_id}
              disabled
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              id="standard-basic"
              label="Id jogo"
              fullWidth
              type="number"
              variant='filled'
              required
              name="jogo_id"
              value={historicoJogos.jogo_id}
              onChange={handleFormFieldChange}
              error={errors?.jogo_id}
              helperText={errors?.jogo_id}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              fullWidth
              name="pontuacao"
              variant='filled'
              type='number'
              label='Nível'
              color="secondary"
              value={historicoJogos.pontuacao}
              onChange={handleFormFieldChange}
              error={errors?.pontuacao}
              helperText={errors?.pontuacao}
            />
          </div>
          <div className='historico-jogo-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
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
              onClick={() => navigate('/historico_jogo')}
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