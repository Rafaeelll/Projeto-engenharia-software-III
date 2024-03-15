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
import Typography from '@mui/material/Typography'
import FormTitle from '../../../components/ui/FormTitle';


export default function VisualizacaoForm() {
  const API_PATH = '/visualizacoes';
  const params = useParams()

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    visualizacoes: {
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
    const visualizacoesCopy = {...visualizacoes}
    visualizacoesCopy[event.target.name] = event.target.value
    setState({...state, visualizacoes: visualizacoesCopy})
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

      const agendaExist = await verifyAgendaExist(visualizacoes.agenda_id)
      if(!agendaExist){
        setState({
          ...state,
          showWaiting: false,
          notif:{
            severity: 'error',
            show: true,
            message: 'ID da agenda não encontrado! Crie uma agenda ou informe um ID válido.'
          }
        })
      }
      
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
        <Typography variant="h5" component="div">
        <form onSubmit={handleFormSubmit}>
           

            <TextField sx={{marginTop: '12px'}}
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
              onClick={() => navigate('/visualizacao')}
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