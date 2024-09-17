import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CollapsibleTableAgenda from '../../components/ui/CollapsibleTableAgenda';

export default function FilterAgendasStatusResult() {
    const { filterStatus } = useParams();  // Obtém o status da URL
    const [data, setData] = useState(null);
    const [state, setState] = useState({
        showDialog: false,
        showWaiting: false,
        deleteId: null,
        
    });
    const { showDialog, showWaiting } = state;
    const API_PATH_AG = '/agendas';


    const [notif, setNotif] = useState({
        show: false,
        message: '',
        severity: 'success',
    });

    const fetchData = async () => {
        setState((prevState) => ({ ...prevState, showWaiting: true }));
        try {
            const result = await myfetch.get(`/agendas/status/${filterStatus}`);
            setData(result);
        } catch (error) {
            console.error(error);
            setNotif({
                show: true,
                message: 'Erro ao buscar as agendas',
                severity: 'error',
            });
        } finally {
            setState((prevState) => ({ ...prevState, showWaiting: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const handleDialogClose = async (answer) => {
        setState((prevState) => ({ ...prevState, showDialog: false }));

        if (answer) {
          try {
            setState((prevState) => ({ ...prevState, showDialog: true }));
            await myfetch.delete(`${API_PATH_AG}/${deleteId}`);
            setNotif({
              show: true,
              message: 'Item excluído com sucesso',
              severity: 'success'
            });
            fetchData();
          } catch (error) {
            console.error(error);
            setNotif({
              show: true,
              message: 'ERRO: ' + error.message,
              severity: 'error'
            });
          } finally {
            setState((prevState) => ({ ...prevState, showWaiting: false }));

          }
        }
      };

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showWaiting}>
                <CircularProgress color="secondary" />
            </Backdrop>

            <ConfirmDialog
                isOpen={showDialog}
                onClose={handleDialogClose}
                title="Confirmar operação"
            >
                Deseja realmente excluir este item?
            </ConfirmDialog>

            <Notification show={notif.show} severity={notif.severity} onClose={() => setNotif({ ...notif, show: false })}>
                {notif.message}
            </Notification>

            {data && <CollapsibleTableAgenda data={data} />}
        </>
    );
}
