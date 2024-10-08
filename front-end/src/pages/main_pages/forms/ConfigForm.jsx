import React from 'react'
import myfetch from '../../../utils/myfetch'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import FormTitle from '../../../components/ui/FormTitle';
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate, Link, useParams } from 'react-router-dom'
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Notification from '../../../components/ui/Notification';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';


export default function ConfigForm() {
  const { id } = useParams(); // Capturando o ID da URL
  const API_PATH = '/configuracoes'
  const navigate = useNavigate()

  const [state, setState] = React.useState({
    configuracoes: {
      confirmar_auto_ini: '',
      confirmar_auto_fim: '',
      horario_notif_inicio: '',
      horario_notif_fim: '',
    },
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success'
    }
  })
  const {configuracoes, showWaiting, notif} = state;

  function handleFormFieldChange(event) {
    const ConfiguracoesCopy = {...configuracoes}
    ConfiguracoesCopy[event.target.name] = event.target.value
    setState({...state, configuracoes: ConfiguracoesCopy})
  }

  function handleFormSubmit(event){
    event.preventDefault();

    sendData()
  }
  React.useEffect(() =>{
    if(id) fetchData()
  }, [])

  async function fetchData() {
    setState({...state, showWaiting: true})
    try {
      const result = await myfetch.get(`${API_PATH}/${id}`)
      setState({
        ...state,
        configuracoes: result,
        showWaiting: false
      })
    } catch(error){
      console.error(error)
      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO:' + error.message
        }
      })
    } 
  }
  async function sendData(){
    setState({...state, showWaiting: true})
    try{
      if (id) await myfetch.put(`${API_PATH}/${id}`, configuracoes)

      else await myfetch.post(API_PATH, configuracoes)

      setState({
        ...state,
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Item salvo com sucesso'
        }
      })
    }catch (error){
      console.error(error)
      setState({
        ...state, 
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
          message: 'ERRO:'  + error.message // Exiba a mensagem de erro personalizada
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
        sx={{
          width: '500px',
          background: 'whitesmoke',
          maxHeight: '75vh',
          overflow: 'auto',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle title="Editar Configurações"/>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ minWidth: 120, marginTop: '20px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Confirmar Inicialização Das Agendas Automaticamente?</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Confirmar Inicialização Das Agendas Automaticamente?"
                  name="confirmar_auto_ini"
                  value={configuracoes.confirmar_auto_ini}
                  onChange={handleFormFieldChange}
                  required
                >
                  <MenuItem value={true}> Sim </MenuItem>
                  <MenuItem value={false}> Não (Padrão)</MenuItem>
                </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, marginTop: '20px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Confirmar Finalização Das Agendas Automaticamente?</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Confirmar Finalização Das Agendas Automaticamente?"
                  name="confirmar_auto_fim"
                  value={configuracoes.confirmar_auto_fim}
                  onChange={handleFormFieldChange}
                  required
                >
                  <MenuItem value={true}> Sim </MenuItem>
                  <MenuItem value={false}> Não (Padrão)</MenuItem>
                </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, marginTop: '20px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Notificações De Início (Agendas)</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Notificações De Início (Agendas)"
                  name="horario_notif_inicio"
                  value={configuracoes.horario_notif_inicio}
                  onChange={handleFormFieldChange}
                  required
                >
                  <MenuItem value={'1 Hora Antes (Padrão)'}> 1 Hora Antes (Padrão)</MenuItem>
                  <MenuItem value={'30 minutos antes'}> 30 minutos antes</MenuItem>
                  <MenuItem value={'No Início'}> Notificar somente no início</MenuItem>
                </Select>
            </FormControl>
          </Box>


          <Box sx={{ minWidth: 120, marginTop: '20px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Notificações De Fim (Agendas)</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label=">Notificações De Início (Agendas)"
                  name="horario_notif_fim"
                  value={configuracoes.horario_notif_fim}
                  onChange={handleFormFieldChange}
                  required
                >
                  <MenuItem value={'1 Hora Antes'}> 1 Hora Antes</MenuItem>
                  <MenuItem value={'30 minutos antes'}> 30 minutos antes</MenuItem>
                  <MenuItem value={'No Fim (Padrão)'}> Notificar somente no fim (Padrão)</MenuItem>
                </Select>
            </FormControl>
          </Box>

          <div className='agenda-form-btn' style={{ display: 'flex', justifyContent: 'center'}}>
            <Button
              sx={{
                margin: '10px',
                background: 'black',
                fontWeight: 'bold',
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
                background: 'black',
                fontWeight: 'bold',
              }}
              color="error"
              variant='contained'
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
          </div>
        </form>
      </Paper>
    </>
  )
}
