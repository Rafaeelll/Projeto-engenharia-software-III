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
import Paper from '@mui/material/Paper'
import Typography  from '@mui/material/Typography';
import Button  from '@mui/material/Button';

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
      data_horario_inicio: '',
      data_horario_fim: ''
    },
    errors: {},
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success'
    }
  });
  const { criarAgendas, errors, showWaiting, notif } = state;

  function getStatusOptions() {
    const currentDate = new Date();
    const inicio = new Date(criarAgendas.data_horario_inicio);
    const fim = new Date(criarAgendas.data_horario_fim);

    if (inicio < currentDate && fim < currentDate || inicio < currentDate && fim <= currentDate) {
      return ['Finalizada'];
    } else if (inicio <= currentDate && fim >= currentDate) {
      return ['Em andamento'];
    } else {
      return ['Agendado'];
    }
  }

  const statusOptions = getStatusOptions();


  function handleFormFieldChange(event) {
    const criarAgendasCopy = { ...criarAgendas };
    criarAgendasCopy[event.target.name] = event.target.value;

    // Adicione a lógica para calcular o status com base nas datas aqui
    const currentDate = new Date();
    const inicio = new Date(criarAgendasCopy.data_horario_inicio);
    const fim = new Date(criarAgendasCopy.data_horario_fim);

    if (inicio < currentDate && fim < currentDate || inicio < currentDate && fim <= currentDate) {
      criarAgendasCopy.status = 'Finalizada';
    } else if (inicio <= currentDate && fim >= currentDate) {
      criarAgendasCopy.status = 'Em andamento';
    } else {
      criarAgendasCopy.status = 'Agendado';
    }

    setState({ ...state, criarAgendas: criarAgendasCopy });
  }

  async function verifyAgendaExists(usuarioId, dataHorarioInicio, dataHorarioFim) {
    try {
      const result = await myfetch.get(`/agendas?usuario_id=${usuarioId}`);
      const agendas = result || [];

      const inicio = new Date(dataHorarioInicio);
      const fim = new Date(dataHorarioFim);

      for (const agenda of agendas) {
        const agendaInicio = new Date(agenda.data_horario_inicio);
        const agendaFim = new Date(agenda.data_horario_fim);

        // Verifica se o intervalo informado colide com alguma agenda existente
        if (inicio < agendaFim && fim > agendaInicio) {
          return true; // Já existe uma agenda no intervalo informado
        }
      }

      return false; // Não há colisão de intervalos
    } catch (error) {
      return false; // Retorna false em caso de erro
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

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

    const agendaExists = await verifyAgendaExists(criarAgendas.usuario_id, criarAgendas.data_horario_inicio, criarAgendas.data_horario_fim);
    if (agendaExists) {
      setState({
        ...state,
        notif: {
          severity: 'error',
          show: true,
          message: 'Já existe uma agenda programada nesse intervalo de horário para o usuário informado!',
        },
      });
      return;
    }

    sendData();
  }

  React.useEffect(() => {
    if (params.id) fetchData();
  }, []);

  async function fetchData() {
    setState({ ...state, showWaiting: true, errors: {} });
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`);
      setState({
        ...state,
        criarAgendas: result,
        showWaiting: false
      });
    } catch (error) {
      console.error(error);
      setState({
        ...state,
        showWaiting: false,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      });
    }
  }

  async function sendData() {
    setState({ ...state, showWaiting: true, errors: {} });
    try {
      const formattedInicio = format(
        new Date(criarAgendas.data_horario_inicio),
        'yyyy-MM-dd HH:mm'
      );
      const formattedFim = format(
        new Date(criarAgendas.data_horario_fim),
        'yyyy-MM-dd HH:mm'
      );

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

      await Agenda.validateAsync(criarAgendasCopy, { abortEarly: false })

      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, criarAgendasCopy)
      else await myfetch.post(API_PATH, criarAgendasCopy)

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
      });
    }
  }

  async function verifyJogoExists(jogoId) {
    try {
      const result = await myfetch.get(`/jogos/${jogoId}`);
      return !!result;
    } catch (error) {
      return false;
    }
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
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
        <CircularProgress sx={{ margin: '5px' }} color="secondary" />
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
          height: '92%',
          maxHeight: '100%'
        }}
      >
        <FormTitle
          title={params.id ? "Editar agenda" : "Criar agendas"}
        />
        <Typography variant="h5" component="div">
          <form onSubmit={handleFormSubmit}>
              <TextField sx={{marginTop: '10px'}}
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

              <TextField sx={{marginTop: '12px'}}
                label="Id usuario 
                (Este campo é preenchido automaticamente)"
                type="number"
                variant='filled'
                fullWidth
                required
                name="usuario_id"
                value={criarAgendas.usuario_id}
                onChange={handleFormFieldChange}
                disabled
              />

              <TextField sx={{marginTop: '12px'}}
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

              <TextField sx={{marginTop: '12px'}}
                required
                type="datetime-local"
                label='Início'
                name="data_horario_inicio"
                fullWidth
                value={criarAgendas.data_horario_inicio}
                onChange={handleFormFieldChange}
              />

              <TextField sx={{marginTop: '12px'}}
                required
                label='Fim'
                color='secondary'
                type="datetime-local"
                name="data_horario_fim"
                fullWidth
                value={criarAgendas.data_horario_fim}
                onChange={handleFormFieldChange}
              />

              <Autocomplete
                id="status-autocomplete"
                options={statusOptions}
                renderInput={(params) => (
                  <TextField sx={{marginTop: '12px'}}
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

              <TextField sx={{marginTop: '12px'}}
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

              <TextField sx={{marginTop: '12px'}}
                label='Descrição'
                fullWidth
                type="text"
                name="descricao"
                value={criarAgendas.descricao}
                onChange={handleFormFieldChange}
                error={errors?.descricao}
                helperText={errors?.descricao}
              />
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
