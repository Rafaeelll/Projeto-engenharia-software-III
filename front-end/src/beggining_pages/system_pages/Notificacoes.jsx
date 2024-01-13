import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PageTitle from '../../components/ui/PageTitle';
import Button from '@mui/material/Button';
import myfetch from '../../utils/myfetch';
import { Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Notification from '../../components/ui/Notification';
import Divider from '@mui/material/Divider'
import Backdrop from '@mui/material/Backdrop'
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

export default function Notificacoes() {
  const API_PATH = '/notificacoes';
  const params = useParams()


  const [state, setState] = useState({
    notificacoes: [],
    showWaiting: false,
    showDialog: false,
    deleteId: null,
    deleteAgendaId: null,
    notif: {
      show: false,
      message: '',
      severity: 'success'
    }
  });

  const { notificacoes, showWaiting, showDialog, deleteId, deleteAgendaId, notif } = state;

  async function fetchData() {
    setState({ ...state, showWaiting: true });
    try {
      const result = await myfetch.get(API_PATH);
      setState({
        ...state,
        notificacoes: result,
        showWaiting: false,
        showDialog: false,
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        showWaiting: false,
        showDialog: false,
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function cancelNotification(id) {
    try {
      await myfetch.delete(`/notificacoes/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
      return false;
    }
  }
  
  async function cancelAgenda(id) {
    try {
      await myfetch.delete(`/agendas/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar agenda:', error);
      return false;
    }
  }
  

  async function handleDialogClose(answer) {
    if (answer) {
      setState({ ...state, showWaiting: true, showDialog: false });
      const notificationCancelled = await cancelNotification(deleteId);
      const agendaCancelled = await cancelAgenda(deleteAgendaId);
  
      if (notificationCancelled && agendaCancelled) {
        setState(prevState => ({
          ...prevState,
          showWaiting: false,
          showDialog: false,
          notif: {
            show: true,
            message: 'Notificação e agenda canceladas com sucesso',
            severity: 'success'
          }
        }));
        fetchData();
      } else {
        setState(prevState => ({
          ...prevState,
          showWaiting: false,
          showDialog: false,
          notif: {
            show: true,
            message: 'Erro ao cancelar notificação e/ou agenda',
            severity: 'error'
          }
        }));
      }
    } else {
      setState(prevState => ({ ...prevState, showDialog: false }));
    }
  }
  
  
  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setState(prevState => ({ ...prevState, notif: { show: false } }));
  }
  
  const handleCancelClick = (id, agenda_id) => {
    setState(prevState => ({
      ...prevState,
      deleteId: id,
      deleteAgendaId: agenda_id,
      showDialog: true
    }));
  };
  async function confirmarPresenca(id) {
    try {
      await myfetch.put(`${API_PATH}/${id}`, { confirmacao_presenca: true });
      return true;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      return false;
    }
  }
  
  const handleConfirmClick = async (id) => {
    console.log('A função handleConfirmedClick está sendo chamada.');

    const presencaConfirmada = await confirmarPresenca(id);
  
    if (presencaConfirmada) {
      setState(prevState => ({
        ...prevState,
        showWaiting: false,
        showDialog: false,
        notif: {
          show: true,
          message: 'Presença confirmada',
          severity: 'success'
        }
      }));
      fetchData();
    } else {
      setState(prevState => ({
        ...prevState,
        showWaiting: false,
        showDialog: false,
        notif: {
          show: true,
          message: 'Erro ao confirmar presença',
          severity: 'error'
        }
      }));
    }
  };
  async function setNotConfirmed(id) {
    try {
      await myfetch.put(`${API_PATH}/${id}`, { confirmacao_presenca: false });
      return true;
    } catch (error) {
      console.error('Erro ao definir como "Não Confirmado":', error);
      return false;
    }
  }
  async function handleNotConfirmedClick(id) {
    console.log('A função handleNotConfirmedClick está sendo chamada.');

    const notConfirmed = await setNotConfirmed(id);
    if (notConfirmed) {
      setState(prevState => ({
        ...prevState,
        notif: {
          show: true,
          message: 'Presença não confirmada',
          severity: 'error',
        },
      }));
      fetchData();
    } else {
      setState(prevState => ({
        ...prevState,
        notif: {
          show: true,
          message: 'Erro ao atualizar presença',
          severity: 'error',
        },
      }));
    }
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
  
      <ConfirmDialog
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item? Ao excluir, a agenda também será excluída.
      </ConfirmDialog>
  
      <Notification
        show={notif.show}
        severity={notif.severity}
        onClose={handleNotifClose}
      >
        {notif.message}
      </Notification>
  
      <PageTitle title="Suas Notificações" />
  
      <Paper
        sx={{ margin: '20px', background: 'whitesmoke', maxHeight: '400px', overflowY: 'auto' }}
      >
        {notificacoes.length > 0 ? (
          notificacoes.map((notificacao) => (
            <div key={notificacao.id}>
              <h1 style={{ fontFamily: 'monospace', margin: '10px', fontSize: '12px', color: '#D4A6F8', fontWeight: 'bold' }}>
                {format(parseISO(notificacao.data_notificacao), 'dd/MM/yyyy - HH:mm')}
              </h1>
              <p style={{ fontFamily: 'monospace', margin: '10px', fontSize: '15px', fontWeight: 'bolder'}}>
                {notificacao.mensagem}
              </p>
              <Button
                sx={{
                  margin: '5px',
                  justifyContent: 'center',
                  fontSize: '10px',
                  backgroundColor: 'black',
                }}
                color="secondary"
                variant="contained"
                onClick={() => handleCancelClick(notificacao.id, notificacao.agenda_id)}>
                Cancelar
              </Button>
              <Button
                sx={{
                  margin: '5px',
                  justifyContent: 'center',
                  fontSize: '10px',
                  backgroundColor: 'black',
                }}
                color="secondary"
                variant="contained"
                onClick={() =>
                  notificacao.confirmacao_presenca
                    ? handleConfirmClick(notificacao.id)
                    : handleNotConfirmedClick(notificacao.id) // Adicione esta função
                }
              >
                {notificacao.confirmacao_presenca ? 'Confirmado' : 'Não Confirmado'}
              </Button>
              <Button
                sx={{
                  margin: '5px',
                  justifyContent: 'center',
                  fontSize: '10px',
                  backgroundColor: 'black',
                }}
                color="secondary"
                variant="contained"
                component={Link}
                to={`/criar_agenda/${notificacao.agenda_id}`}
                >
                Adiar
              </Button>
  
              <Divider sx={{marginTop: '5px'}}/>
  
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'gray' }}>
            <p>Sem notificações</p>
          </div>
        )}
      </Paper>
    </>
  );
  
}
