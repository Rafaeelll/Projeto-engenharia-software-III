import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../../../components/ui/Notification';
import Button from '@mui/material/Button';
import myfetch from '../../../utils/myfetch';
import { Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField';
import '../../../styles/styles.css'
import FormTitle from '../../../components/ui/FormTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Typography  from '@mui/material/Typography';



export default function NotiConfirmFinish() {
    const API_PATH = '/notificacoes';
    const params = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState({
        notificacoes: {
            agenda_id: '',
            mensagem: '',
            confirmacao_finalizacao: ''
        },
        showWaiting: false,
        notif: {
          show: false,
          message: '',
          severity: 'success'
        }
      });
      const statusOptions = [
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ];    
      const { notificacoes, showWaiting, notif } = state;

      function handleFormFieldChange(event) {
        const notificacoesCopy = { ...notificacoes };
        const { name, value } = event.target;
    
        // Se o campo for confirmacao_presenca, convertemos "Sim" para true e "Não" para false
        notificacoesCopy[name] = name === 'confirmacao_finalizacao' ? (value === 'Sim') : value;
    
        setState({ ...state, notificacoes: notificacoesCopy });
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
            notificacoes: result,
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
          if (params.id) await myfetch.put(`${API_PATH}/${params.id}`, notificacoes)
          else await myfetch.post(API_PATH, notificacoes)
    
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
          console.error(error)
          setState({
            ...state,
            showWaiting: false,
            errors: errorMessages,
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
          width: '500px',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          background: 'whitesmoke',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          p: '12px',
        }}
      >
        <FormTitle
          title={"Editar notificações"}
        />
        <Typography variant="h5" component="div">
          <form onSubmit={handleFormSubmit}>
              <TextField sx={{marginTop: '10px'}}
                id="standard-basic"
                label="Id da agenda"
                type="name"
                variant='filled'
                color='secondary'
                required
                fullWidth
                name="agenda_id"
                value={notificacoes.agenda_id}
                onChange={handleFormFieldChange}
                disabled
              />

              <TextField sx={{marginTop: '12px'}}
                required
                type="text"
                label='Mensagem'
                name="mensagem"
                fullWidth
                value={notificacoes.mensagem}
                onChange={handleFormFieldChange}
                disabled
              />

              <Autocomplete sx={{marginTop: '12px'}}
                id="status-autocomplete"
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                      required
                      fullWidth
                      name="confirmacao_finalizacao"
                      variant="filled"
                      type="text"
                      label="Confirmar Finalização"
                      color="secondary"
                      value={notificacoes.confirmacao_finalizacao ? 'Sim' : 'Não'}
                      onChange={handleFormFieldChange}
                    />
                )}
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
                color="secondary"
                variant='contained'
                onClick={() => navigate('/criar_agenda/' + notificacoes.agenda_id)}
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
        </Typography>
      </Paper>
    </div>
  );
}
