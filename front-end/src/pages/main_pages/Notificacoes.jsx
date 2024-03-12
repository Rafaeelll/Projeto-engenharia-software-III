import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataGridTitle from '../../components/ui/DataGridTitle';
import myfetch from '../../utils/myfetch';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Backdrop from '@mui/material/Backdrop'
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export default function Notificacoes() {
  const API_PATH = '/notificacoes';
  const API_PATH2 = '/agendas';



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

  const columns = [
    { 
      field: 'id', 
      headerName: 'Cód.', 
      width: 90 
    },
 
    {
      field: 'data_notificacao',
      headerName: 'Data da notificação',
      width: 150,
      valueFormatter: (params) => format(parseISO(params.value), 'dd/MM/yyyy' + ' - hh:mm'),
    },

    {
      field: 'mensagem',
      headerName: 'Mensagem',
      headerAlign: 'center',
      width: 450,
    },
    {
      field: 'confirmacao_presenca',
      headerName: 'Presença confirmada',
      width: 150,
      valueGetter: (params) => params.value ? 'Sim' : 'Não'
    },
    {
      field: 'confirmacao_finalizacao',
      headerName: 'Finalização Confirmada',
      width: 150,
      valueGetter: (params) => params.value ? 'Sim' : 'Não'
    },
    
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => {
        const notificationMessage = params.row.mensagem;
        let redirectPath = '';
        if (notificationMessage.includes('prestes a começar')) {
          redirectPath = `/notificacao/confirmar-presenca/${params.id}`;
        } else if (notificationMessage.includes('já finalizou')) {
          redirectPath = `/notificacao/confirmar-finalizacao/${params.id}`;
        } else {
          // Define um redirecionamento padrão caso a mensagem não corresponda a nenhum caso esperado
          redirectPath = `/notificacao/confirmar-default/${params.id}`;
        }
        return (
          <Link to={redirectPath}>
            <IconButton aria-label="Editar">
              <EditIcon />
            </IconButton>
          </Link>
        );
      }
    },
    {
      field: 'delete',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => (
        <IconButton 
          aria-label="excluir"
          onClick={() => {
            const agendaId = params.row.agenda_id; // Verifique se agenda_id está corretamente definido
            if (agendaId) {
              setState({
                ...state,
                deleteAgendaId: agendaId, // guarda o id do item a ser excluído
                deleteId: params.id, 
                showDialog: true      // mostra o diálogo de confirmação
              });
            } else {
              console.error(error);
            }
          }}
        >
          <DeleteForeverIcon color="error" />
        </IconButton>
      )
    }
  ];
  

  async function handleDialogClose(answer) {
    if(answer) {
      // Fecha o diálogo de confirmação e exibe o backdrop
      setState({ ...state, showWaiting: true, showDialog: false })
      try {
        await myfetch.delete(`${API_PATH}/${deleteId}`)

        await myfetch.delete(`${API_PATH2}/${deleteAgendaId}`)

        setState({
          ...state,
          showWaiting: false,   // esconde o backdrop
          showDialog: false,    // esconde o diálogo de confirmação
          notif: {              // exibe a snackbar
            show: true,
            message: 'Itens excluídos com sucesso',
            severity: 'success'
          }
        })
        // Recarrega os dados da listagem
        fetchData()
      }
      catch(error) {
        console.error(error)
        setState({
          ...state,
          showWaiting: false,   // esconde o backdrop
          showDialog: false,    // esconde o diálogo de confirmação
          notif: {              // exibe a snackbar
            show: true,
            message: 'ERRO: ' + error.message,
            severity: 'error'
          }
        })
      }
    }
    else {
      // Fecha o diálogo de confirmação
      setState({ ...state, showDialog: false })
    }
  }
  
  
  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, notif: { show: false } })
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <DataGridTitle title="Suas Notificações" />

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

      <Paper elevation={4} sx={{ height: 450, width: '60%', margin: '0 auto'}}>
          <DataGrid sx={{fontFamily: 'arial', fontWeight: 'medium', background: 'whitesmoke', color: '#470466', fontSize: '13px'}}
                rows={notificacoes}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                
            />
        </Paper>
     </>
  );
  
}
