import React from 'react'
import myfetch from '../../../utils/myfetch';
import PageTitle from '../../../components/ui/PageTitle';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Notification from '../../../components/ui/Notification';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

  export default function Jogos() {
    const API_PATH = '/jogos'

  
    const [state, setState] = React.useState({
      jogos: [],
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
      jogos,
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
          jogos: result, 
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
      { field: 'id', headerName: 'Cód.', width: 90 },
      {
        field: 'nome',
        headerName: 'Nome',
        width: 150
      },
      {
        field: 'usuario_id',
        headerName: 'Id usuário',
        width: 150,
        valueGetter: params => params.row?.usuario.id  + ': ' + params.row?.usuario.nome + ' ' + params.row?.usuario.sobrenome,

      },
      {
        field: 'data_jogo',
        headerName: 'Data de aquisição',
        width: 150,
        valueFormatter: (params) => formatDate(params.value),
      },
      {
        field: 'edit',
        headerName: 'Editar',
        headerAlign: 'center',
        align: 'center',
        width: 90,
        renderCell: params => (
          <Link to={'./' + params.id}>
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
            snack: {              // exibe a snackbar
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
            snack: {              // exibe a snackbar
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
          severity={notif.severity}
          onClose={handleNotifClose}
        >
          {notif.message}
        </Notification>


        <PageTitle title="Listagem de jogos"  />
  
        <Box sx={{
          display: "flex",
          justifyContent: "right",
          marginBottom: "25px"
        }}>
          <Link to="new">
            <Button style={{marginRight: '20px'}}
              variant="contained" 
              size="large" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Cadastrar novo
            </Button>
          </Link>

          <Link to="/historico_jogo">
            <Button style={{marginRight: '20px'}}
              variant="contained" 
              size="large" 
              color="secondary"
              startIcon={<HistoryIcon/>}
            >
              Históricos
            </Button>
          </Link>
        </Box>
  
        <Paper elevation={4} sx={{ height: 450, width: '70%', margin: '0 auto'}}>
        <DataGrid sx={{fontFamily: 'arial', fontWeight: 'medium', background: 'whitesmoke', color: '#470466', fontSize: '13px'}}
            rows={jogos}
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
