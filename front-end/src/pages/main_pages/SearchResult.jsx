import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CollapsibleTableAgenda from '../../components/ui/CollapsibleTableAgenda';
import CollapsibleTableJogo from '../../components/ui/CollapsibleTableJogo';
import CollapsibleTableHistorico from '../../components/ui/CollapsibleTableHistorico';
import CollapsibleTableVisualizacao from '../../components/ui/CollapsibleTableVisualizacao';
import CollapsibleTableNotificacao from '../../components/ui/CollapsibleTableNotificacao';

function SearchResult() {
  const { opcao, id } = useParams();
  const [data, setData] = useState(null);
  const [state, setState] = useState({
    showDialog: false,
    showWaiting: false,
    deleteId: null,
  });
  const { showDialog, showWaiting } = state;

  const [notif, setNotif] = useState({
    show: false,
    message: '',
    severity: 'success',
  });

  const tableComponents = {
    agendas: CollapsibleTableAgenda,
    jogos: CollapsibleTableJogo,
    historico_jogos: CollapsibleTableHistorico,
    visualizacoes: CollapsibleTableVisualizacao,
    notificacoes: CollapsibleTableNotificacao
  };

  const TableComponent = tableComponents[opcao] || null;

  async function fetchData() {
    try {
      setState({ ...state, showWaiting: true });

      let response;
      if (id) {
        response = await myfetch.get(`/${opcao}/${id}`);
      } else {
        return 'ID não digitado ou opção não selecionada'
      }

      setData(Array.isArray(response) ? response : [response]);
      setState({ ...state, showWaiting: false });
    } catch (error) {
      console.error('Erro ao buscar data:', error);
      setNotif({
        show: true,
        message: 'Erro ao buscar data',
        severity: 'error',
      });
      setState({ ...state, showWaiting: false });
    }
  }

  useEffect(() => {
    fetchData();
  }, [id, opcao]);

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') return;
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
        fetchData();
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
      
      {data ? (
        TableComponent ? (
          <TableComponent data={data} onDelete={handleDialogClose} />
        ) : (
          <Notification
            show={true}
            onClose={handleNotifClose}
            severity="error"
          >
            Componente não encontrado para a opção selecionada.
          </Notification>
        )
      ) : (
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showWaiting}
          >
            <CircularProgress color="secondary" />
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