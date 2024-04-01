import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages';
import Agenda from '../../../../models/Agenda';
import FormTitle from '../../../components/ui/FormTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

export default function CriarAgendas() {
  const API_PATH = '/agendas';
  const params = useParams();
  const navigate = useNavigate();
  const [showWaiting, setShowWaiting] = React.useState(false)
  const [state, setState] = React.useState({
    criarAgendas: {
      titulo_agenda: '',
      plt_transm: '',
      jogo_id: '',
      descricao: '',
      data_horario_inicio: '',
      data_horario_fim: '',
    },
    jogosList: [], // Estado para armazenar a lista de jogos
    errors: {},
    notif: {
      show: false,
      message: '',
      severity: 'success',
    },
  });

  const { criarAgendas, jogosList, errors, notif } = state;

  function handleFormFieldChange(event) {
    const criarAgendasCopy = { ...criarAgendas };
    criarAgendasCopy[event.target.name] = event.target.value;

    setState({ ...state, criarAgendas: criarAgendasCopy });
  }

  async function handleGameIdClick() {
    try {
      // Verifica se a lista de jogos já está preenchida
      if (jogosList.length === 0) {
        setState({ ...state, errors: {} }); 
        setShowWaiting(true)// Define o estado como true quando a busca começar

        const response = await myfetch.get('/jogos');

        if (response.length === 0) {
          throw new Error('Nenhum jogo encontrado');
        }

        const formattedJogosList = response.map(jogo => ({
          id: jogo.id,
          nome: jogo.nome,
        }));

        setState({ ...state, jogosList: formattedJogosList }); // Atualiza apenas a lista de jogos
      }
    } catch (error) {
      console.error(error);
      setState({
        ...state,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message,
        },
      });
      setShowWaiting(false)

    } finally {
      setShowWaiting(false)
    }
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

    const agendaExists = await verifyAgendaExists(
      criarAgendas.usuario_id,
      criarAgendas.data_horario_inicio,
      criarAgendas.data_horario_fim
    );
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
    setState({ ...state, errors: {} });
    setShowWaiting(true)
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`);
      setState({
        ...state,
        criarAgendas: result,
      });        
      setShowWaiting(false)

    } catch (error) {
      console.error(error);
      setState({
        ...state,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message,
        },
      });
    }
  }

  async function sendData() {
    setState({ ...state, errors: {} });
    setShowWaiting(true)
    try {
      console.log(criarAgendas);
      const jogoExists = await verifyJogoExists(criarAgendas.jogo_id);
      if (!jogoExists) {
        setState({
          ...state,
          notif: {
            severity: 'error',
            show: true,
            message: 'ID do jogo não encontrado! Crie um jogo ou informe um ID válido.',
          },
        });
        setShowWaiting(false)
        return;
      }

      await Agenda.validateAsync(criarAgendas, { abortEarly: false });

      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, criarAgendas);
      else await myfetch.post(API_PATH, criarAgendas);

      setState({
        ...state,
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso',
        },
      });
      setShowWaiting(false)

    } catch (error) {
      const { validationError, errorMessages } = getValidationMessages(error);
      console.error(error);
      setState({
        ...state,
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: !validationError,
          message: 'ERRO: ' + error.message,
        },
      });
      setShowWaiting(false)
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

  // Função para lidar com a mudança de seleção de jogo
  function handleJogoListChange(event) {
    const selectedJogoId = event.target.value;
    setState({
      ...state,
      criarAgendas: {
        ...criarAgendas,
        jogo_id: selectedJogoId,
      },
    });
  }

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        justifyContent: 'center',
        background: 'whitesmokesss',
      }}
      className="pai"
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
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
          maxHeight: '100%',
        }}
      >
        <FormTitle title={params.id ? 'Editar agenda' : 'Criar agendas'} />
        <Typography variant="h5" component="div">
          <form onSubmit={handleFormSubmit}>
            <TextField
              sx={{ marginTop: '10px' }}
              id="standard-basic"
              label="Título"
              type="name"
              variant="filled"
              color="secondary"
              required
              fullWidth
              name="titulo_agenda"
              value={criarAgendas.titulo_agenda}
              onChange={handleFormFieldChange}
              error={errors?.titulo_agenda}
              helperText={errors?.titulo_agenda}
            />

            <Box sx={{ minWidth: 120, marginTop: '12px' }}>
              <FormControl fullWidth>
                <Select
                  label="Jogo"
                  variant='filled'
                  required
                  value={criarAgendas.jogo_id}
                  onChange={handleJogoListChange}
                  onClick={handleGameIdClick}
                  name="jogo_id"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecione um jogo
                  </MenuItem>
                  {jogosList.map(jogo => (
                    <MenuItem key={jogo.id} value={jogo.id}>
                      {jogo.id} - {jogo.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              sx={{ marginTop: '12px' }}
              required
              type="datetime-local"
              label="Início"
              name="data_horario_inicio"
              fullWidth
              value={criarAgendas.data_horario_inicio}
              onChange={handleFormFieldChange}
            />

            <TextField
              sx={{ marginTop: '12px' }}
              required
              label="Fim"
              color="secondary"
              type="datetime-local"
              name="data_horario_fim"
              fullWidth
              value={criarAgendas.data_horario_fim}
              onChange={handleFormFieldChange}
            />

            <TextField
              sx={{ marginTop: '12px' }}
              label="Plataforma"
              type="name"
              fullWidth
              name="plt_transm"
              variant="filled"
              color="secondary"
              value={criarAgendas.plt_transm}
              onChange={handleFormFieldChange}
              error={errors?.plt_transm}
              helperText={errors?.plt_transm}
            />

            <TextField
              sx={{ marginTop: '12px' }}
              label="Descrição"
              fullWidth
              type="text"
              name="descricao"
              value={criarAgendas.descricao}
              onChange={handleFormFieldChange}
              error={errors?.descricao}
              helperText={errors?.descricao}
            />
            <div className="agenda-form-btn" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
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
                variant="contained"
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
                variant="contained"
                onClick={() => navigate(-1)}
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
