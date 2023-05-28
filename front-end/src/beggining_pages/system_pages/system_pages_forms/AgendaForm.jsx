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
import Agenda from '../../../../models/Agenda'
import PageTitle from '../../../components/ui/PageTitle';

export default function CriarAgendas() {
  const API_PATH = '/agendas';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    criarAgendas: {
      titulo_agenda: '',
      usuario_id: '',
      plt_transm: '',
      jogo_id: '',
      descricao: '',
      status: '',
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { criarAgendas, errors, showWaiting, notif } = state;
  
  function handleFormFieldChange(event) {
    const { name, value } = event.target;
  
    let updatedValue = value;
  
    // Verifica se o campo requer conversão de hora
    if (name === 'data_horario_inicio' || name === 'data_horario_fim') {
      const [hours, minutes] = value.split(':');
      const formattedValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      updatedValue = formattedValue;
    }
  
    // Atualiza o valor do campo correspondente no objeto criarAgendas
    const criarAgendasCopy = { ...criarAgendas, [name]: updatedValue };
  
    // Atualiza o estado com o novo objeto criarAgendasCopy
    setState({ ...state, criarAgendas: criarAgendasCopy });
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
        criarAgendas: result,
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
      await Agenda.validateAsync(criarAgendas, { abortEarly: false })

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, criarAgendas)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, criarAgendas)

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
        title={params.id ? "Editar agenda" : "Criar agendas"} 
      />
      <div
        className="agenda-container"
        style={{
          width: '30%',
          margin: '0 auto',
          padding: '30px',
          marginTop: '15px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          height: '98%'
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
            Crie sua agenda
          </span>
          <div className='wrap-input3'>
            <TextField
              id="standard-basic"
              label="Título"
              type="name"
              variant='filled'
              color='secondary'
              required
              fullWidth
              name="titulo_agenda"
              value={criarAgendas.titulo_agenda}
              onChange={handleFormFieldChange}
              error={errors?.titulo_agenda}
              helperText={errors?.titulo_agenda}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              label="Id usuario"
              type="number"
              variant='filled'
              fullWidth
              required
              name="usuario_id" // Nome do campo na tabela
              value={criarAgendas.usuario_id} // Nome do campo na tabela
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
              color='secondary'
              variant='filled'
              required
              name="jogo_id"
              value={criarAgendas.jogo_id}
              onChange={handleFormFieldChange}
              error={errors?.jogo_id}
              helperText={errors?.jogo_id}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              required
              type="datetime-local"
              label='Início'
              name="data_horario_inicio"
              fullWidth
              value={criarAgendas.data_horario_inicio}
              onChange={handleFormFieldChange}
            />
          </div>
          
          <div className='wrap-input3'>
            <TextField
              required
              label='Fim'
              color='secondary'
              type="datetime-local"
              name="data_horario_fim"
              fullWidth
              value={criarAgendas.data_horario_fim}
              onChange={handleFormFieldChange}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              required
              fullWidth
              name="status"
              variant='filled'
              type='text'
              label='Status'
              color="secondary"
              value={criarAgendas.status}
              onChange={handleFormFieldChange}
              error={errors?.status}
              helperText={errors?.status}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              label='Plataforma'
              type="name"
              fullWidth
              name="plt_transm"
              variant='filled'
              color="secondary"
              value={criarAgendas.plt_transm}
              onChange={handleFormFieldChange}
              error={errors?.plt_transm}
              helperText={errors?.plt_transm}
            />
          </div>

          <div className='wrap-input3'>
            <TextField
              required
              label='Descrição'
              type="name"
              variant='filled'
              name="descricao"
              value={criarAgendas.descricao}
              onChange={handleFormFieldChange}
              error={errors?.descricao}
              helperText={errors?.descricao}
            />
          </div>
          <div className='agenda-form-btn' style={{display: 'flex', justifyContent: 'center'}}>
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
              onClick={() => navigate('/agenda')}
            >
              Cancelar
            </button>
          </div>       
        </form>
      </div>
    </div>
  );
}