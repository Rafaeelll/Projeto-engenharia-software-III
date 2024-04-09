import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import myfetch from '../../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../../components/ui/Notification';
import getValidationMessages from '../../../utils/getValidationMessages'
import Visualizacao from '../../../../models/Visualizacao'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import FormTitle from '../../../components/ui/FormTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';



export default function VisualizacaoForm() {
  const API_PATH = '/visualizacoes';
  const params = useParams()
  const navigate = useNavigate();

  const [showWaiting, setShowWaiting] = React.useState(false)
  const [state, setState] = React.useState({
    visualizacoes: {
      agenda_id: '',
      numero_visualizacao: ''
    },
    agendaList: [], // Estado para armazenar a lista de jogos
    errors: {},
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  });
  const { visualizacoes, agendaList, errors, notif } = state;
  
  function handleFormFieldChange(event) {
    const visualizacoesCopy = {...visualizacoes}
    visualizacoesCopy[event.target.name] = event.target.value
    setState({...state, visualizacoes: visualizacoesCopy})
  }

  async function handleAgendaIdClick() {
    try {
      // Verifica se a lista de jogos já está preenchida
      if (agendaList.length === 0) {
        setState({ ...state, errors: {} }); 
        setShowWaiting(true)// Define o estado como true quando a busca começar

        const response = await myfetch.get('/agendas');

        if (response.length === 0) {
          throw new Error('Nenhum jogo encontrado');
        }

        const formattedAgendasList = response.map(agenda => ({
          id: agenda.id,
          titulo_agenda: agenda.titulo_agenda,
        }));

        setState({ ...state, agendaList: formattedAgendasList }); // Atualiza apenas a lista de jogos
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
    setState({...state, errors:{}})
    setShowWaiting(true)
    try {
      const result = await myfetch.get(`${API_PATH}/${params.id}`)
      setState({
        ...state,
        visualizacoes: result,
      })
      setShowWaiting(false)
    }
    catch(error) {
      console.error(error)
      setState({
        ...state, 
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
        }
      })
      setShowWaiting(false)

    }
  }

  async function sendData() {
    setState({...state, errors: {}})
    setShowWaiting(true)
    try {

      const agendaExist = await verifyAgendaExist(visualizacoes.agenda_id)
      if(!agendaExist){
        setState({
          ...state,
          notif:{
            severity: 'error',
            show: true,
            message: 'ID da agenda não encontrado! Crie uma agenda ou informe um ID válido.'
          }
        })
        setShowWaiting(false)
      }
      
      // Chama a validação da biblioteca Joi
      await Visualizacao.validateAsync(visualizacoes, { abortEarly: false })

      // Registro já existe: chama PUT para atualizar
      if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, visualizacoes)
      
      // Registro não existe: chama POST para criar
      else await myfetch.post(API_PATH, visualizacoes)

      setState({
        ...state, 
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        }
      })
      setShowWaiting(false)

    }
    catch(error) {
      const { validationError, errorMessages } = getValidationMessages(error)

      console.error(error)
      
      setState({
        ...state, 
        errors: errorMessages,
        notif: {
          severity: 'error',
          show: !validationError,
          message: 'ERRO: ' + error.message
        }
      })
      setShowWaiting(false)
    }
    async function verifyAgendaExist(agendaId){
      try{
        const result = await myfetch.get(`/agendas/${agendaId}`)
        return !!result;
      }catch(error){
        return false
      }
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

   // Função para lidar com a mudança de seleção de agenda
   function handleAgendaListChange(event) {
    const selectedAgendaId = event.target.value;
    setState({
      ...state,
      visualizacoes: {
        ...visualizacoes,
        agenda_id: selectedAgendaId,
      },
    });
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
      className="visualizacao-container"
      sx={{
        width: '512px',
        maxWidth: '90%',
        margin: '25px auto 0 auto',
        background: 'whitesmoke',
        borderRadius: '5px',
        p: '12px',
        boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
      }}
      >
        <FormTitle
          title={params.id ? "Editar visualização" : "Crie sua visualização"} 
        /> 
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ minWidth: 120, marginTop: '12px' }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Selecione uma agenda</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Selecione uma agenda"
                  variant='outlined'
                  required
                  value={visualizacoes.agenda_id}
                  onChange={handleAgendaListChange}
                  onClick={handleAgendaIdClick}
                  name="agenda_id"
                  displayEmpty
                >
                 {agendaList.length === 0 ? (
                  <MenuItem disabled>
                    Nenhuma agenda encontrada!
                  </MenuItem>
                 ) : (
                  agendaList.map(agenda => (
                    <MenuItem key={agenda.id} value={agenda.id}>
                      {agenda.id} - {agenda.titulo_agenda}
                    </MenuItem>
                  ))
                 )}
                </Select>
              </FormControl>
            </Box>

          <TextField sx={{marginTop: '12px'}}
            fullWidth
            name="numero_visualizacao"
            type='number'
            label='Total visualizações'
            value={visualizacoes.numero_visualizacao}
            onChange={handleFormFieldChange}
            error={errors?.numero_visualizacao}
            helperText={errors?.numero_visualizacao}
          />
          <div className="visualicao-form-btn" style={{ display: 'flex', justifyContent: 'center' }}>
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
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
}