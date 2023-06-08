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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';


export default function PaginaInicial() {

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
      const result = await myfetch.get(API_PATH);
      const agendaPendentes = result.filter(agenda => agenda.status === 'Agendado' || agenda.status === 'Em andamento'
      );
      const formattedAgendaPendentes = agendaPendentes.map(agenda => ({
        ...agenda,
        data_horario_inicio: format(parseISO(agenda.data_horario_inicio), 'dd/MM/yyyy - HH:mm'),
        data_horario_fim: format(parseISO(agenda.data_horario_fim), 'dd/MM/yyyy - HH:mm'),
        usuario_id: capitalizeName(agenda.usuario.nome) + ' ' + capitalizeName(agenda.usuario.sobrenome),
        jogo_id: capitalizeName(agenda.jogo.nome)
      }));
      
      function capitalizeName(name) {
        const firstLetter = name.charAt(0).toUpperCase();
        const restOfName = name.slice(1).toLowerCase();
        return firstLetter + restOfName;
      }
        setState({ 
        ...state, 
        agendaPendentes: formattedAgendaPendentes,
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

  const columns = [
    { field: 'id', headerName: 'Id agenda', width: 90 },
    {
      field: 'usuario_id',
      headerName: 'Id usuário',
      width: 150,
      valueGetter: params => params.row?.usuario.id  + ': ' + params.row?.usuario.nome + ' ' + params.row?.usuario.sobrenome

    },
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
        <Link to={'/criar_agenda/' + params.id}>
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

      <PageTitle title="Listagem de agendas pendentes"/>

      <Box sx={{
        display: "flex",
        justifyContent: "right",
        marginBottom: "25px"
      }}>
        <Link to="/criar_agenda">
          <Button style={{marginRight: '20px'}}
          variant="contained"
          size="large"
          color="secondary"
          startIcon={<AddCircleIcon/>}
          >
          Criar agenda
          </Button>
        </Link>
      </Box>

      <Paper elevation={4} sx={{ height: 450, width: '70%', margin: '0 auto'}}>
        <DataGrid sx={{fontFamily: 'arial', fontWeight: 'medium', background: 'whitesmoke', color: '#470466', fontSize: '13px'}}
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