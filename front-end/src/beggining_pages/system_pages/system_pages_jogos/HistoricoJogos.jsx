import React from 'react'
import myfetch from '../../../utils/myfetch';
import DataGridTitle from '../../../components/ui/DataGridTitle';
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
import GamesIcon from '@mui/icons-material/Games';
import { Link } from 'react-router-dom';



  export default function HistoricoJogos() {
    const API_PATH = '/historico_jogos'
  
    const [state, setState] = React.useState({
      historicoJogos: [],
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
      historicoJogos,
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
          historicoJogos: result, 
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
        field: 'usuario_id',
        headerName: 'Id usuário',
        width: 150,
      },
      {
        field: 'jogo_id',
        headerName: 'Id jogo',
        width: 150,
      },
      {
        field: 'pontuacao',
        headerName: 'Nível',
        width: 150
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

        <DataGridTitle title="Listagem Histórico de Jogos"  />
          <Paper elevation={4} sx={{width: '40%', margin: '0 auto', borderRadius: '0px 0px 5px 5px'}}>
            <DataGrid sx={{
              fontFamily: 'arial', fontWeight: 'medium', 
              background: 'whitesmoke', color: '#470466', 
              fontSize: '13px', borderRadius: '0px 0px 5px 5px'}}
              rows={historicoJogos}
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
                <Link to="new">
                  <Button style={{marginRight: '15px'}}
                    variant="contained" 
                    size="medium" 
                    color="secondary"
                    startIcon={<AddCircleIcon />}
                  >
                    Novo Histórico
                  </Button>
                </Link>

                <Link to="/jogo">
                  <Button style={{marginRight: '15px'}}
                    variant="contained" 
                    size="medium" 
                    color="secondary"
                    startIcon={<GamesIcon/>}
                  >
                    Jogos
                  </Button>
                </Link>
              </Box>
      </>
    )
  }
