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
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

export default function CriarAgendas() {
  const API_PATH = '/agendas';
  const params = useParams();
  const navigate = useNavigate();
  const [showWaiting, setShowWaiting] = React.useState(false)
  const [definirPausa, setDefinir] = React.useState(false)
  const [jogos, setJogos] = React.useState([]);
  const [jogoName, setJogoName] = React.useState('')
  const [loadingJogoName, setLoadingJogoName] = React.useState(false);
  const [state, setState] = React.useState({
    criarAgendas: {
      titulo_agenda: '',
      plt_transm: '',
      jogo_id: [],
      descricao: '',
      jogos_associados: [],
      data_horario_inicio: null,
      data_horario_fim: null,
      p_data_horario_inicio: null,
      p_data_horario_fim: null,
    },
    errors: {},
    notif: {
      show: false,
      message: '',
      severity: 'success',
    },
  });

  const { criarAgendas, errors, notif } = state;

  function handleFormFieldChange(event) {
    const criarAgendasCopy = { ...criarAgendas };
    if (event.target.name === 'jogo_id') {
      const selectedIds = event.target.value;
      criarAgendasCopy[event.target.name] = selectedIds;
      fetchJogoNames(selectedIds); // Fetch names for selected games
    } else {
      criarAgendasCopy[event.target.name] = event.target.value;
    }
    setState({
      ...state,
      criarAgendas: {
        ...criarAgendasCopy,
        jogos_associados: jogoName, // Ensure jogos_associados is updated
      },
    });
  }
  

  // Função para calcular a duração da agenda
  const calculateDuration = () => {
    if (criarAgendas.data_horario_inicio && criarAgendas.data_horario_fim) {
      const diffInMs = criarAgendas.data_horario_fim - criarAgendas.data_horario_inicio;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      return diffInHours;
    }
    return 0;
  };

  // Verificar se a duração é maior que 3 horas
  const isDurationGreaterThan3Hours = calculateDuration() >= 3;

  // Lidar com a mudança dos campos de data e hora
  const handleDateTimeChange = (name, value) => {
    setState({
      ...state,
      criarAgendas: {
        ...criarAgendas,
        [name]: value,
      },
    });
  };

  async function fetchJogoNames(jogoIds) {
    setLoadingJogoName(true);
    try {
      const names = [];
      for (const id of jogoIds) {
        const result = await myfetch.get(`/jogos/${id}`);
        names.push(result.nome);
      }
      setJogoName(names);
    } catch (error) {
      console.error(error);
      setJogoName([]);
    } finally {
      setLoadingJogoName(false);
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
    async function fetchJogos() {
      try {
        const result = await myfetch.get('/jogos'); // Supondo que a rota retorne todos os jogos
        setJogos(result); // Supondo que o resultado seja uma lista de objetos com IDs e outros dados dos jogos
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    }
  
    fetchJogos();
  }, []);

  React.useEffect(() => {
    if (params.id) fetchData();
  }, []);

  async function fetchData() {
    setState({ ...state, errors: {} });
    setShowWaiting(true)
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`);
      result.data_horario_inicio = parseISO(result.data_horario_inicio)
      result.data_horario_fim = parseISO(result.data_horario_fim)
      setState({
        ...state,
        criarAgendas: result,
      }); 
      
      if (result.jogo_id) {
        await fetchJogoNames(result.jogo_id);
      }
      
      setShowWaiting(false)

    } catch (error) {
      console.error(error);
      setState({
        ...state,
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


  function handleDefinirPausaClick(){
    setDefinir(!definirPausa);
  }

  return (
    <>
    
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
          width: '500px',
          margin: '25px auto 0 auto',
          overflow: 'auto',
          maxWidth: '90%',
          background: 'whitesmoke',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          maxHeight: '80vh',
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
                <InputLabel id="jogo-ids-label">ID Jogo</InputLabel>
                <Select 
                  id="standard-basic"
                  label="ID Jogo"
                  color="secondary"
                  multiple
                  name="jogo_id"
                  value={criarAgendas.jogo_id}
                  onChange={handleFormFieldChange}
                  renderValue={(selected) => selected.join(', ')} // Para mostrar IDs selecionados
                >
                  {jogos.map((jogo) => (
                    <MenuItem key={jogo.id} value={jogo.id}>
                      {jogo.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 120, marginTop: '12px', position: 'relative' }}>
              <TextField
                id="standard-basic"
                label="Nome dos Jogos"
                type="text"
                variant="outlined"
                color="secondary"
                fullWidth
                value={Array.isArray(jogoName) ? jogoName.join(', ') : ''} // Verificação antes de usar join
                InputProps={{
                  disabled: true,
                }}
              />
              {loadingJogoName && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>


            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <MobileDateTimePicker
                sx={{ marginTop: '12px' }}
                label="Início"
                value={criarAgendas.data_horario_inicio}
                onChange={value => handleFormFieldChange({
                  target: {name:'data_horario_inicio', value}

                })}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                    required: true
                  }
                }}

              />
            </LocalizationProvider>
              
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <MobileDateTimePicker 
                sx={{ marginTop: '12px' }}
                label="Fim"
                value={criarAgendas.data_horario_fim}
                onChange={value => handleFormFieldChange({
                  target: {name:'data_horario_fim', value}

                })}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    color: 'secondary',
                    fullWidth: true,
                    required: true
                  }
                }}
                minDateTime={criarAgendas.data_horario_inicio}
              />
            </LocalizationProvider>

            {/* Exibir botão de definir pausa somente se a duração da agenda não for >= que 3 horas*/}
            {!isDurationGreaterThan3Hours && (
              <Button
                sx={{mt: '6px'}}
                variant='text'
                startIcon={<AccessAlarmIcon/>}
                onClick={handleDefinirPausaClick}>
                {definirPausa ? 'Nâo Definir Pausa': 'Definir Pausa'}
              </Button>
            )}
            

             {/* Exibir campos de pausa se a duração for >= que 3 horas (obrigatorio) */}
             {isDurationGreaterThan3Hours&& (
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <MobileDateTimePicker
                    sx={{ marginTop: '12px' }}
                    label="Pausa Início"
                    value={criarAgendas.p_data_horario_inicio}
                    onChange={(value) => handleDateTimeChange('p_data_horario_inicio', value)}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                        required: true,
                      },
                    }}
                    minDateTime={criarAgendas.data_horario_inicio}
                    maxDateTime={criarAgendas.data_horario_fim}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <MobileDateTimePicker
                    sx={{ marginTop: '12px' }}
                    label="Pausa Fim"
                    value={criarAgendas.p_data_horario_fim}
                    onChange={(value) => handleDateTimeChange('p_data_horario_fim', value)}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        color: 'secondary',
                        fullWidth: true,
                        required: true,
                      },
                    }}
                    minDateTime={criarAgendas.p_data_horario_inicio}
                    maxDateTime={criarAgendas.data_horario_fim}
                  />
                </LocalizationProvider>
              </Box>
            )}

            {/* Exibir campos de pausa se usuario quiser definir o horario de pausa*/}
            {definirPausa && (
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <MobileDateTimePicker
                    sx={{ marginTop: '12px' }}
                    label="Pausa Início"
                    value={criarAgendas.p_data_horario_inicio}
                    onChange={(value) => handleDateTimeChange('p_data_horario_inicio', value)}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                        required: false,
                      },
                    }}
                    minDateTime={criarAgendas.data_horario_inicio}
                    maxDateTime={criarAgendas.data_horario_fim}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <MobileDateTimePicker
                    sx={{ marginTop: '12px' }}
                    label="Pausa Fim"
                    value={criarAgendas.p_data_horario_fim}
                    onChange={(value) => handleDateTimeChange('p_data_horario_fim', value)}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                        required: false,
                      },
                    }}
                    minDateTime={criarAgendas.p_data_horario_inicio}
                    maxDateTime={criarAgendas.data_horario_fim}
                  />
                </LocalizationProvider>
              </Box>
            )}



            <Box sx={{ minWidth: 120, marginTop: '12px'}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Plataforma de Transmissão</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={criarAgendas.plt_transm}
                    label="Plataforma de Transmissão"
                    name='plt_transm'
                    required
                    onChange={handleFormFieldChange}
                >
                  <MenuItem value={'Facebook'}>Facebook</MenuItem>
                  <MenuItem value={'Kick'}>Kick</MenuItem>
                  <MenuItem value={'Twitch'}>Twitch</MenuItem>
                  <MenuItem value={'Youtube'}>Youtube</MenuItem>
                  <MenuItem value={'Outros'}>Outros</MenuItem>
                </Select>
              </FormControl>
            </Box>

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
            <Box className="agenda-form-btn" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                sx={{
                  margin: '10px',
                  background: 'black',
                  fontWeight: 'bold',
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
                  background: 'black',
                  fontWeight: 'bold',
                }}
                color="error"
                variant="contained"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Typography>
      </Paper>
    </>  
  );
}
