import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Notification from '../../../components/ui/Notification';
import Button from '@mui/material/Button';
import myfetch from '../../../utils/myfetch';
import { Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField';
import FormTitle from '../../../components/ui/FormTitle';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';



export default function AgendaConfirmarFinalizacao() {
    const API_PATH = '/agendas';
    const params = useParams();
    const navigate = useNavigate();
    const [loadingAgendaStatus, setLoadingAgendaStatus] = React.useState(false);


    const [state, setState] = useState({
        agendas: {
          id: '',
          titulo_agenda: '',
          confirmacao_finalizacao: '',
          status: ''

        },
        showWaiting: false,
        notif: {
          show: false,
          message: '',
          severity: 'success'
        }
      }); 
      const { agendas, showWaiting, notif } = state;

      function handleFormFieldChange(event) {
        const AgendasCopy = { ...agendas };
        AgendasCopy[event.target.name] = event.target.value;
        setLoadingAgendaStatus(true); // Exibe o CircularProgress


        // Adicionar a lógica para mudança automática do status
        const dataAtual = new Date();
        const dataFinal = new Date(agendas.data_horario_fim);
        
        let statusAgenda = "Agendado";

        if (dataAtual >= dataFinal) {
          if (AgendasCopy.confirmacao_finalizacao === true) {
              statusAgenda = "Finalização Confirmada";
          } else {
              statusAgenda = "Finalização Pendente";
          }
        }

        // Atualiza o status com a lógica aplicada
        AgendasCopy.status = statusAgenda;

        setState({ ...state, agendas: AgendasCopy });

        setTimeout(() => {
          setLoadingAgendaStatus(false); // Esconde o CircularProgress
          setState({ ...state, agendas: AgendasCopy });
        }, 500); // Aqui, 500ms é o tempo de simulação do atraso
      }
    
      async function handleFormSubmit(event) {
        event.preventDefault();
        sendData();
    }

    useEffect(() => {
        if (params.id) fetchData();
      }, []);
    
      async function fetchData() {
        setState({ ...state, showWaiting: true });
        try {
            const result = await myfetch.get(`${API_PATH}/${params.id}`);
            setState({
            ...state,
            agendas: result,
            showWaiting: false,
          });
        } catch (error) {
          console.log(error);
          setState({
            ...state,
            showWaiting: false,
            notif:{
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
          if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, agendas)
          else await myfetch.post(API_PATH, agendas)
  
          setState({
            ...state,
            showWaiting: false,
            notif: {
              severity: 'success',
              show: true,
              message: agendas.confirmacao_finalizacao ? (
                <>
                  Finalização confirmada com sucesso. Se deseja informar a quantidade de visualizações para essa agenda,{' '}
                  <Link to={`/visualizacao/new?agenda_id=${agendas.id}`}>clique aqui</Link>.
                </>
              ) : 'Item salvo com sucesso.'
            }
          });
        } catch (error) {
          console.error(error)
          setState({
            ...state,
            showWaiting: false,
            notif: {
              severity: 'error',
              message: 'ERRO: ' + error.message
            }
          });
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
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress sx={{ margin: '5px' }} color="secondary" />
        Por favor, aguarde.
      </Backdrop>

      <Notification show={notif.show} severity={notif.severity} onClose={handleNotifClose} duration={8000}>
        {notif.message}
      </Notification>

      <Paper
        className="agenda-container"
        sx={{
          width: '500px',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          background: 'whitesmoke',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
        }}
      >
        <FormTitle
          title={"Editar agendas"}
        />
          <form onSubmit={handleFormSubmit}>
              <TextField sx={{marginTop: '10px'}}
                id="standard-basic"
                label="Id da agenda"
                type="name"
                variant='filled'
                color='secondary'
                required
                fullWidth
                name="id"
                value={agendas.id}
                onChange={handleFormFieldChange}
                disabled
              />

              <TextField sx={{marginTop: '12px'}}
                required
                type="text"
                label='Titulo da Agenda'
                name="titulo_agenda"
                fullWidth
                value={agendas.titulo_agenda}
                onChange={handleFormFieldChange}
                disabled
              />
              <Box sx={{ minWidth: 120, marginTop: '12px'}}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Confirmar finalização</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={agendas.confirmacao_finalizacao}
                      label="Confirmar finalização"
                      name='confirmacao_finalizacao'
                      onChange={handleFormFieldChange}
                      required
                    >
                    <MenuItem value={true}>Sim</MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
                  </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 120, marginTop: '12px', position: 'relative' }}>
              <TextField
                required
                type="text"
                label='Status da Agenda'
                name="status"
                fullWidth
                value={agendas.status}
                onChange={handleFormFieldChange}
                disabled
              />
              {loadingAgendaStatus && (
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
                color="secondary"
                variant='contained'
                onClick={() => navigate('/agenda/' + agendas.id)}
              >
                Adiar agenda
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
                Voltar
              </Button>
            </div>
          </form>
      </Paper>
    </>
  );
}