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
import Visualizacao from '../../../../models/Visualizacao'
import PageTitle from '../../../components/ui/PageTitle';

export default function VisualizacaoForm() {
  const API_PATH = '/visualizacoes';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    visualizacoes: {
      usuario_id: '',
      agenda_id: '',
      numero_visualizacao: ''
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { visualizacoes, errors, showWaiting, notif } = state;
  
  function handleFormFieldChange(event) {
    const { name, value } = event.target;
  
    let updatedValue = value;
  
    // Verifica se o campo requer conversão de hora
    if (name === 'data_visualizacao'){
      const [hours, minutes] = value.split(':');
      const formattedValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      updatedValue = formattedValue;
    }
  
    // Atualiza o valor do campo correspondente no objeto visualizacoes
    const visualizacoesCopy = { ...visualizacoes, [name]: updatedValue };
  
    // Atualiza o estado com o novo objeto visualizacoesCopy
    setState({ ...state, visualizacoes: visualizacoesCopy });
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
        visualizacoes: result,
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
      await Visualizacao.validateAsync(visualizacoes, { abortEarly: false })

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, visualizacoes)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, visualizacoes)

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
    if (notif.severity === 'success') navigate('/visualizacao');
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
        className="visualicao-form-container"
        style={{
          width: '30%',
          margin: '0 auto',
          padding: '30px',
          marginTop: '15px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          height: '65%'
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
            Crie suas visualizaçoes
          </span>
          <div className='wrap-input3'>
            <TextField
              label="Id usuario"
              type="number"
              variant='filled'
              fullWidth
              color='secondary'
              required
              name="usuario_id" // Nome do campo na tabela
              value={visualizacoes.usuario_id} // Nome do campo na tabela
              onChange={handleFormFieldChange}
              error={errors?.usuario_id}
              helperText={errors?.usuario_id}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              id="standard-basic"
              label="Id agenda"
              variant='filled'
              fullWidth
              type="number"
              required
              name="agenda_id"
              value={visualizacoes.agenda_id}
              onChange={handleFormFieldChange}
              error={errors?.agenda_id}
              helperText={errors?.agenda_id}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              required
              label='Data de visualização'
              type="datetime-local"
              variant='filled'
              color='secondary'
              name="data_visualizacao"
              fullWidth
              value={visualizacoes.data_visualizacao}
              onChange={handleFormFieldChange}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              fullWidth
              name="numero_visualizacao"
              type='number'
              label='Total visualizações'
              value={visualizacoes.numero_visualizacao}
              onChange={handleFormFieldChange}
              error={errors?.numero_visualizacao}
              helperText={errors?.numero_visualizacao}
            />
          </div>
          <div className="visualicao-form-btn" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                margin: '10px',
                padding: '5px 20px',
                border: 'none',
                background: 'black',
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '25px'
              }}
              type="submit"
            >
              Salvar
            </button>
            <button
              style={{
                margin: '10px',
                padding: '5px 20px',
                border: 'none',
                background: 'black',
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '25px'
              }}
              onClick={() => navigate('/visualizacao')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}