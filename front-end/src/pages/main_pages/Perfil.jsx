import React from 'react'
import myfetch from '../../utils/myfetch';
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
import { format, parseISO, isValid } from 'date-fns';
import './styles/main-pages-styles.css'


  export default function Perfil() {
    const API_PATH = '/usuarios'


    const [state, setState] = React.useState({
      perfils: [],
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
      perfils,
      showWaiting,
      showDialog,
      deleteId,
      notif
    } = state
  
    async function fetchData() {
      setState({ ...state, showWaiting: true })
      try {
        const result = await myfetch.get(API_PATH)

        const formattedProfiles = result.map(perfil => {
          const parsedDate = parseISO(perfil.data_nasc);
          const formattedDate = isValid(parsedDate) ? format(parsedDate, 'dd/MM/yyyy') : '';

          
          return {
            ...perfil,
            data_nasc: formattedDate,
            nome_completo: perfil.nome + ' ' + perfil.sobrenome
          }
        });

        const capitalizedProfiles = formattedProfiles.map(perfil => ({
          ...perfil,
          nome_completo: capitalizeFullName(perfil.nome_completo)
        }));

        function capitalizeFullName(fullName) {
          const [firstName, ...lastNameParts] = fullName.split(' ');
          const lastName = lastNameParts.map(part => capitalizeFirstLetter(part)).join(' ');
        
          return capitalizeFirstLetter(firstName) + ' ' + lastName;
        }
        
        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        setState({ 
          ...state, 
          perfils: capitalizedProfiles, 
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
        field: 'nome_completo',
        headerName: 'Nome',
        width: 150
      },
      {
        field: 'email',
        headerName: 'E-mail',
        width: 150
      },
      {
        field: 'telefone',
        headerName: 'Telefone',
        width: 150
      },
      {
        field: 'data_nasc',
        headerName: 'Data de nascimento',
        width: 150
      },
      {
        field: 'plataforma_fav',
        headerName: 'Plataforma favorita',
        width: 150
      },
      {
        field: 'jogo_fav',
        headerName: 'Jogo favorito',
        width: 150
      },
      {
        field: 'image',
        headerName: 'Foto de perfil',
        width: 150,
        renderCell: params => (
          <img src={import.meta.env.VITE_BACKEND_URI_FILES + params.row.image} alt="Foto de Perfil" style={{ width: 65, borderRadius: '50%' }} />
        )
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
          <h1 style={{ margin: '0', fontSize: '20px' }}>
            <strong> 
              Dados Cadastral
            </strong>
          </h1>
      </Box>
        <Paper elevation={4} sx={{width: '70%', margin: '0 auto', borderRadius: '0px 0px 5px 5px'}}>
          <DataGrid 
            sx={{
              fontFamily: 'arial', fontWeight: 'medium', 
              background: 'whitesmoke', color: '#470466', 
              fontSize: '13px', borderRadius: '0px 0px 5px 5px'}}
              rows={perfils}
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
          justifyContent: "Center",
          marginTop: "25px"
        }}>
          <Link to="/cadastro">
            <Button
              variant="contained" 
              size="medium" 
              color="secondary"
              startIcon={<AddCircleIcon />}
            >
              Novo Usúario
            </Button>
            </Link>
          </Box>
      </>
    )
  }
