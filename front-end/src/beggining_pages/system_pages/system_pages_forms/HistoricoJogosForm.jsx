import HeaderBar from '../../../components/ui/HeaderBar';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import '../../../styles.css'
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import HistoricoJogo from '../../../../models/HistoricoJogo'
import PageTitle from '../../../components/ui/PageTitle';

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
    const { name, value } = event.target;
  
    let updatedValue = value;
  
    // Verifica se o campo requer conversão de hora
    if (name === 'data_jogo'){
      const [hours, minutes] = value.split(':');
      const formattedValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      updatedValue = formattedValue;
    }
  
    // Atualiza o valor do campo correspondente no objeto historicoJogos
    const historicoJogosCopy = { ...historicoJogos, [name]: updatedValue };
  
    // Atualiza o estado com o novo objeto historicoJogosCopy
    setState({ ...state, historicoJogos: historicoJogosCopy });
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
        <CircularProgress color="secondary" />
      </Backdrop>

      <Notification show={notif.show} severity={notif.severity} onClose={handleNotifClose}>
        {notif.message}
      </Notification>
      <div>
        <HeaderBar />
      </div>

      <PageTitle 
        title={params.id ? "Editar Historico de Jogos" : "Criar histórico de jogos"} 
      />
      <div
        className="HistoricoJogo-container"
        style={{
          width: '30%',
          margin: '0 auto',
          padding: '30px',
          marginTop: '15px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          height: '60%'
        }}
      >
        <form style={{ width: '100%' }} onSubmit={handleFormSubmit}>
          <span
            style={{
              textAlign: 'center',
              width: '100%',
              background: 'purple',
              borderRadius: '5px',
              fontFamily: 'monospace',
              fontSize: '25px',
              display: 'block',
              fontWeight: 'bold',
              color: 'whitesmoke',
              top: 'auto',
              marginBottom: '20px'
            }}
          >
            Crie o Histórico de Jogos
          </span>
          <div className='wrap-input3'>
            <TextField
              label="Id usuario"
              type="number"
              fullWidth
              variant='filled'
              required
              name="usuario_id" // Nome do campo na tabela
              value={historicoJogos.usuario_id} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.usuario_id}
              helperText={errors?.usuario_id}
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
              required
              label='Data de aquisição'
              type="datetime-local"
              name="data_jogo"
              fullWidth
              value={historicoJogos.data_jogo}
              onChange={handleFormFieldChange}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              fullWidth
              name="pontuacao"
              variant='filled'
              type='number'
              label='Pontuação'
              color="secondary"
              value={historicoJogos.pontuacao}
              onChange={handleFormFieldChange}
              error={errors?.pontuacao}
              helperText={errors?.pontuacao}
            />
          </div>
          <div className='historico-jogo-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
            <button
              style={{
                margin: '10px',
                padding: '5px 20px 5px 20px',
                border: 'none',
                background: 'black',
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              type="submit"
            > 
              Salvar
            </button>
            <button
              style={{
                margin: '10px',
                padding: '5px 20px 5px 20px',
                border: 'none',
                background: 'black',
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/historico_jogo')}
            >
              Cancelar
            </button>
          </div>       
        </form>
      </div>
    </div>
  );
}