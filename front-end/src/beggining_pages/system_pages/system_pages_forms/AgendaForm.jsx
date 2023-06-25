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
import FormTitle from '../../../components/ui/FormTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { format } from 'date-fns';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"
import Paper from '@mui/material/Paper'
import Typography  from '@mui/material/Typography';
import Button  from '@mui/material/Button';

export default function CriarAgendas() {
  const API_PATH = '/agendas';
  const params = useParams()
  const statusOptions = ["Agendado", "Em andamento", "Finalizada"];

  const navigate = useNavigate();

  // const [selectedDate, setselectedDate] = React.useState(null);
  const [state, setState] = React.useState({
    criarAgendas: {
      titulo_agenda: '',
      usuario_id: '',
      plt_transm: '',
      jogo_id: '',
      descricao: '',
      status: '',
      data_horario_inicio: '',
      data_horario_fim: ''
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
    const criarAgendasCopy = {...criarAgendas}
    criarAgendasCopy[event.target.name] = event.target.value
    setState({...state, criarAgendas: criarAgendasCopy})
  }
  
  
  function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada
  
    // Verifica se a data de término é maior do que a data de início
    const inicio = new Date(criarAgendas.data_horario_inicio);
    const fim = new Date(criarAgendas.data_horario_fim);
    if (fim <= inicio) {
      setState({
        ...state,
        notif: {
          severity: 'error',
          show: true,
          message: 'A data de término deve ser maior do que a data de início!',
        },
      });
      return;
    }
  
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
        // Formata os valores da data/hora antes de enviar
        const formattedInicio = format(
          new Date(criarAgendas.data_horario_inicio),
          'yyyy-MM-dd HH:mm' // Formato desejado
        );
        const formattedFim = format(
          new Date(criarAgendas.data_horario_fim),
          'yyyy-MM-dd HH:mm' // Formato desejado
        );
    
        // Atualiza os valores formatados no objeto criarAgendas
        const criarAgendasCopy = {
          ...criarAgendas,
          data_horario_inicio: formattedInicio,
          data_horario_fim: formattedFim,
        };
        
        const jogoExists = await verifyJogoExists(criarAgendas.jogo_id);
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
      await Agenda.validateAsync(criarAgendasCopy, { abortEarly: false })

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, criarAgendasCopy)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, criarAgendasCopy)

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
        className="agenda-container"
        sx={{
          width: '512px',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          background: 'whitesmoke',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          p: '12px',
          height: '95%',
          maxHeight: '100%'
          
        }}
      >
        <FormTitle
          title={params.id ? "Editar agenda" : "Criar agendas"} 
        /> 
        <Typography variant="h5" component="div">
        <form onSubmit={handleFormSubmit}>        
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
              required
              fullWidth
              type="number"
              color='secondary'
              variant='filled'
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
          <Autocomplete
            id="status-autocomplete"
            options={statusOptions}
            renderInput={(params) => (
              <TextField
                {...params}
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
            )}
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
              label='Descrição'
              fullWidth
              type="text"
              name="descricao"
              value={criarAgendas.descricao}
              onChange={handleFormFieldChange}
              error={errors?.descricao}
              helperText={errors?.descricao}
            />
          </div>
          <div className='agenda-form-btn' style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
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
              onClick={() => navigate('/agenda')}
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