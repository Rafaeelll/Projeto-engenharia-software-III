import React from 'react'
import myfetch from '../../utils/myfetch'
import PageTitle from '../../components/ui/PageTitle'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Notification from '../../components/ui/Notification';
import HeaderBar from '../../components/ui/HeaderBar';


export default function PaymentMethodList() {

  const API_PATH = '/agendas'

  const [state, setState] = React.useState({
    agendaPendentes: [],
    showWaiting: false,
    showDialog: false,
    deleteId: null,
    notif: {
      show: false,
      message: '',
      severity: 'success' // ou 'error'
    }
  })
  const {
    agendaPendentes,
    showWaiting,
    showDialog,
    deleteId,
    notif
  } = state

  async function fetchData() {
    setState({ ...state, showWaiting: true })
    try {
      const result = await myfetch.get(API_PATH)
      setState({ 
        ...state, 
        agendaPendentes: result, 
        showWaiting: false,
        showDialog: false
      })
    }
    catch(error) {
      console.log(error)
      setState({ 
        ...state, 
        showWaiting: false,
        showDialog: false
      })
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const columns = [
    { field: 'id', headerName: 'Id agenda', width: 90 },
    {
      field: 'usuario_id',
      headerName: 'Id do usuário',
      width: 150
    },
    {
      field: 'jogo_id',
      headerName: 'Id do jogo',
      width: 150
    },
    {
      field: 'data_agenda',
      headerName: 'Data',
      width: 150
    },
    {
      field: 'horario_inicio',
      headerName: 'Início',
      width: 150
    },
    {
      field: 'horario_fim',
      headerName: 'Término',
      width: 150
    },
    {
      field: 'titulo_agenda',
      headerName: 'Título',
      width: 150
    },
    {
      field: 'plt_transm',
      headerName: 'Plataforma',
      width: 150
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150
    },
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => (
        <IconButton aria-label="Editar">
          <EditIcon />
        </IconButton>
      )
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
          onClick={() => setState({
            ...state,
            deleteId: params.id,  // guarda o id do item a ser excluído
            showDialog: true      // mostra o diálogo de confirmação
          })}
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
        setState({
          ...state,
          showWaiting: false,   // esconde o backdrop
          showDialog: false,    // esconde o diálogo de confirmação
          notif: {              // exibe a snackbar
            show: true,
            message: 'Item excluído com sucesso',
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
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ConfirmDialog 
        title="Confirmar operação"
        open={showDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>

      <Notification 
        show={notif.show} 
        onClose={handleNotifClose}
        severity={notif.severity}
      >
        {notif.message}
      </Notification>

      <HeaderBar/>

      <PageTitle title="Listagem de agendas"  />

      <Paper elevation={4} sx={{ height: 500, width: '70%', margin: '0 auto' }}>
        <DataGrid
          rows={agendaPendentes}
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
  )
}