import HeaderBar from '../../components/ui/HeaderBar';
import React from 'react';
import DatePickerTest from '../../components/ui/DatePickerTest'
import TimePicker from '../../components/ui/TimePicker'
import TimePicker2 from '../../components/ui/TimePicker2'
import {useNavigate } from 'react-router-dom'
import TextField  from '@mui/material/TextField';
import  Box from '@mui/material/Box';
import myfetch from '../../utils/myfetch'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../components/ui/Notification'


export default function CriarAgendas() {
  const API_PATH = '/agendas'

  const navigate = useNavigate()

  const [state, setState] = React.useState({
    criarAgendas: {}, // Objeto vazio
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  })
  const {
    criarAgendas,
    showWaiting,
    notif
  } = state

  function handleFormFieldChange(event) {
    const criarAgendasCopy = {...criarAgendas}
    criarAgendasCopy[event.target.name] = event.target.value
    setState({...state, criarAgendas: criarAgendasCopy})
  }

  function handleFormSubmit(event) {
    event.preventDefault()    // Evita que a página seja recarregada

    // Envia os dados para o back-end
    sendData()
  }

  async function sendData() {
    setState({...state, showWaiting: true})
    try {
      await myfetch.post(API_PATH, criarAgendas)
      //DAR FEEDBACK POSITIVO
      setState({
        ...state, 
        showWaiting: false,
        notif: {
          severity: 'success',
          show: true,
          message: 'Novo cadastro salvo com sucesso!'
        }
      })
    }
    catch(error) {
      console.error(error)
      // DAR FEEDBACK NEGATIVO
      setState({
        ...state, 
        showWaiting: false,
        notif: {
          severity: 'error',
          show: true,
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
    if(notif.severity === 'success') navigate(-1)
    setState({ ...state, notif: { ...notif, show: false } })
  };
  return (
    
    <div style={{ 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      height: '100vh', 
      justifyContent: 'center', 
      background: 'whitesmokesss' }} 
      className="pai">
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="secondary" />
          </Backdrop>

          <Notification 
            show={notif.show} 
            severity={notif.severity}
            onClose={handleNotifClose}
          >
            {notif.message}
          </Notification>
      <div>
        <HeaderBar />
      </div>
        <div className='agenda-container' style={{
          width:'30%', 
          margin: '0 auto', 
          padding: '30px', 
          marginTop: '30px', 
          border: '5px', 
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)', 
          borderRadius: '5px', 
          borderColor: 'red'
          }}>
          <form onSubmit={handleFormSubmit}>
            <span style={{
              textAlign: 'center', 
              fontFamily: 'monospace', 
              fontSize: '25px', 
              display: 'block', 
              top:'auto'}}>
                Crie sua agenda
            </span>
            <Box
              component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
              <TextField 
                id="standard-basic" 
                label="Título" 
                variant="standard"
                color='secondary' 
                required
                name='titulo_agenda'
                value={criarAgendas.titulo_agenda}
                onChange={handleFormFieldChange}
              />
            </Box>
            <TextField 
              label="Id usuario" 
              variant="standard"
              color='secondary' 
              type="number"
              required
              name="usuario_id"  // Nome do campo na tabela
              value={criarAgendas.usuario_id}   // Nome do campo na tabela
              onChange={handleFormFieldChange}
            />
              <DatePickerTest
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
                required
                name="data_agenda"
                value={criarAgendas.data_agenda}
                onChange={handleFormFieldChange}
                />
              <TimePicker
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
                required
                name="horario_inicio"
                value={criarAgendas.horario_inicio}
                onChange={handleFormFieldChange}
              />
              <TimePicker2
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
                required
                name="horario_fim"
                value={criarAgendas.horario_fim}
                onChange={handleFormFieldChange}
              />
            <button style={{margin: '5px'}} type="submit">Salvar</button>
            <button onClick={() => navigate('/agenda')}>Cancelar</button>
          </form>
        </div>
    </div>
  );

}