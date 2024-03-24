import React from 'react'
import myfetch from '../../utils/myfetch'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Notification from '../../components/ui/Notification';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import './styles/main-pages-styles.css'


export default function VerificarAgendas() {

  const API_PATH = '/agendas'

  const [state, setState] = React.useState({
    agendas: [],
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
    agendas,
    showWaiting,
    showDialog,
    deleteId,
    notif
  } = state

  async function fetchData() {
    setState({ ...state, showWaiting: true })
    try {
      const result = await myfetch.get(API_PATH);
      const agendas = result.filter(agenda => agenda.status === 'Agendado' || agenda.status === 'Em andamento' 
      || agenda.status === 'Finalizada');
      const formattedAgendas = agendas.map(agenda => ({
        ...agenda,
        data_horario_inicio: format(parseISO(agenda.data_horario_inicio), 'dd/MM/yyyy - HH:mm'),
        data_horario_fim: format(parseISO(agenda.data_horario_fim), 'dd/MM/yyyy - HH:mm'),

      }));
      
        setState({ 
        ...state, 
        agendas: formattedAgendas,
        showWaiting: false,
        showDialog: false
      });
      
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

  function getStatusColor(status){
    switch (status){
      case 'Agendado':
        return 'red';
      case 'Finalizada':
        return 'green';
      case 'Em andamento':
        return 'lightblue';
      default:
        return 'black';
    }
    
  }

  const columns = [
    { field: 'id', headerName: 'Id agenda', width: 90 },
    {
      field: 'jogo_id',
      headerName: 'Id Jogo',
      width: 150,
      valueGetter: params => params.row?.jogo.id  + ': ' + params.row?.jogo.nome
    },
    {
      field: 'data_horario_inicio',
      headerName: 'Início',
      width: 150,
    },

    {
      field: 'data_horario_fim',
      headerName: 'Término',
      width: 150,
    },
    {
      field: 'titulo_agenda',
      headerName: 'Título',
      width: 150
    },
    {
      field: 'plt_transm',
      headerName: 'Plataforma',
      width: 150,
    },
    {
      field: 'p_data_horario_inicio',
      headerName: "Início Pausa",
      width: 150,

    },
    {
      field: 'p_data_horario_fim',
      headerName: "Fim Pausa",
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
      width: 150,
      renderCell: params =>(
        <div
          style={{
            color: getStatusColor(params.value),
            fontWeight: 'bold'
          }}
          >
            {params.value}
        </div>
      )
    },
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => (
        <Link to={'/agenda/' + params.id}>
          <IconButton aria-label="Editar">
            <EditIcon />
          </IconButton>
        </Link>
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
        <CircularProgress color="secondary" />
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

      <Box 
        sx={{ 
          width: '70%', 
          margin: '0 auto', 
          backgroundColor: 'black', 
          color: 'white', 
          fontFamily: 'arial', 
          marginTop: '50px', 
          borderRadius: '5px 5px 0px 0px', 
          textAlign: 'center', 
          padding: '10px', 
          borderStyle: 'groove' }}> 
          <h1 style={{ margin: '0 auto', fontSize: '20px' }}>
            <strong> 
              Listagem de Agendas
            </strong>
          </h1>
      </Box> 
      <Paper elevation={4} sx={{width: '70%', margin: '0 auto', borderRadius: '0px 0px 5px 5px'}}>
        <DataGrid 
          sx={{
            fontFamily: 'arial', fontWeight: 'medium', 
            background: 'whitesmoke', color: '#470466', 
            fontSize: '13px', borderRadius: '0px 0px 5px 5px'}}
            rows={agendas}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0, pageSize: 5,
                },
              },
            }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </Paper>

      <Box sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "25px"
      }}>
        <Link to="/agenda/new">
          <Button style={{marginRight: '20px'}}
          variant="contained"
          size="medium"
          color="secondary"
          startIcon={<AddCircleIcon/>}
          >
          Nova agenda
          </Button>
        </Link>
      </Box>
    </>
  )
}