import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../components/ui/Notification'
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Box from '@mui/material/Box';
import CollapsibleTableJogo from '../../components/ui/CollapsibleTableJogo'; // Importe o componente CollapsibleTableJogo
import './styles/main-pages-styles.css';

function SearchResult() {
  const { opcao, id } = useParams();
  const [detalhes, setDetalhes] = useState([]);
  const [state, setState] = useState({
    showDialog: false,
    showWaiting: false,
    deleteId: null,
  });
  const { showDialog, showWaiting, deleteId } = state;

  const [notif, setNotif] = useState({
    show: false,
    message: '',
    severity: 'success', // ou 'error'
  });

  async function fetchDetalhes() {
    try {
      const response = await myfetch.get(`/${opcao}/${id}`);
      setDetalhes(response);
      setState({
        ...state,
        showWaiting: false,
        showDialog: false,
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      setNotif({
        show: true,
        message: error.message,
        severity: 'error',
      });
      setState({
        ...state,
        showWaiting: false,
        showDialog: false,
      });
    } finally {
      setState({
        ...state,
        showWaiting: false,
        showDialog: false,
      });
    }
  }

  useEffect(() => {
    fetchDetalhes();
  }, [opcao, id]);

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ show: false });
  }

  async function handleDialogClose(answer) {
    if (answer) {
      setState({ ...state, showWaiting: true, showDialog: false });
      try {
        await myfetch.delete(`/${opcao}/${deleteId}`);
        setNotif({
          show: true,
          message: 'Item excluído com sucesso',
          severity: 'success',
        });
        fetchDetalhes();
      } catch (error) {
        console.error(error);
        setNotif({
          show: true,
          message: 'ERRO: ' + error.message,
          severity: 'error',
        });
      }
    } else {
      setState({ ...state, showDialog: false });
    }
  }

  return (
    <>
      <ConfirmDialog
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>


      {detalhes.length > 0 ? (
        <CollapsibleTableJogo
          jogoId={detalhes} // Passe os dados de detalhes para o componente
          onDelete={handleDialogClose} // Passe a função para o componente
        />
      ) : (
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="secondary" />
            Por favor, aguarde.
          </Backdrop>

          <Notification
            show={notif.show}
            onClose={handleNotifClose}
            severity={notif.severity}
          >
            {notif.message}
          </Notification>
        </>
      )}
    </>
  );
}

export default SearchResult;