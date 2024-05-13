import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import myfetch from '../../../utils/myfetch';
import ConfirmDialogMyAccountStatus from '../../../components/ui/ConfirmDialogMyAccountStatus'
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop  from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Notification from '../../../components/ui/Notification';
import Paper  from '@mui/material/Paper';
import FormTitle from '../../../components/ui/FormTitle';
import { styled } from '@mui/material/styles';
import  Tooltip, {tooltipClasses} from '@mui/material/Tooltip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton'
import PersonOffIcon from '@mui/icons-material/PersonOff';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import HowToRegIcon from '@mui/icons-material/HowToReg';


export default function MyAccountStatusForm({onLoginLogout}) {

  const API_PATH_US = '/usuarios'
  const API_PATH_AS  =  '/usuarios/account_status'
  const { id } = useParams(); // Capturando o ID da URL
  const [showWaiting, setShowWaiting] = React.useState(false)
  const [showDialog, setShowDialog] = React.useState(false)
  const [isAccountActive, setIsAccountActive] = React.useState(true); // Inicia como true, mas deve ser atualizado com base no estado real do banco de dados
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success' // ou 'error'
  })
  const navigate = useNavigate()

  const [state, setState] = React.useState({
    myAccountDatas: {
      nome: '',
      sobrenome: '',
      email: '',
      status: ''  
    },
  });
  const { myAccountDatas } = state;


  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip placement="bottom-end" {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  async function handleButtonClick (answer) {
    if(answer) {
      setShowWaiting(true)
      setShowDialog(false)
      try {
        await myfetch.put(`${API_PATH_AS }/${id}`, myAccountDatas);
        setIsAccountActive((prevStatus) => !prevStatus); // Inverte o status atual
        setNotif({
          severity: 'success',
          show: true,
          message: 'Dados salvos com sucesso!'
        });

        await myfetch.post('/usuarios/logout2');
        onLoginLogout(false);
        // Aguarde as chamadas assíncronas serem concluídas antes de atualizar o estado
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
      catch(error) {
        console.error(error)
      }
      finally {
        setShowWaiting(false)
        setShowDialog(false)      
      }
    }
    else setShowDialog(false)      
    }

  async function fetchData() {
    setState({...state, showWaiting: true})
    try {
      // Verifica se params.id é definido antes de fazer a busca
      if (id) {
        const result = await myfetch.get(`${API_PATH_US}/${id}`);
        setState({
          ...state,
          myAccountDatas: result,
        });
        setShowWaiting(false)
        setIsAccountActive(result.status)

      } else {
        console.error('ID da conta não foi definido.');
      }
    }
    catch(error) {
      console.error(error)
      setShowWaiting(false)
      setNotif({
        severity: 'error',
          show: true,
          message: 'ERRO: ' + error.message
      })
    }
  }
  React.useEffect(() => {
    // Se houver parâmetro id na rota, devemos carregar um registro
    // existente para edição
    if(id) fetchData()
  }, [])

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({show: false });
  }
  

  return (
    <>
      {
        !isAccountActive && 
        <ConfirmDialogMyAccountStatus
          open={showDialog}
          onClose={handleButtonClick }
          title="Confirmar Operação"
          warning={
            <Typography>
              {myAccountDatas.nome}, ao confirmar essa operação sua conta será ativada
              novamente.
            </Typography>
          }
        >
        </ConfirmDialogMyAccountStatus>
      }
      {
        isAccountActive && 
        <ConfirmDialogMyAccountStatus
          open={showDialog}
          onClose={handleButtonClick }
          title="Atenção"
          warning={
            <Typography>
              {myAccountDatas.nome}, se você deseja desativar sua conta, o seu cadastro ficará com status "Inativo"
              por um período de 30 dias. Caso você não ativar sua conta novamente dentro desse período, 
              o seu cadastro será excluído automaticamente. 
            </Typography>            
          }
          warning2={
            <Typography> 
              Ao confirmar essa operação clicando no 
              botão "OK" você será direcionado para página de login e precisará realizar o login novamente.
            </Typography>
          }
        >
        </ConfirmDialogMyAccountStatus>
      }

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <Notification show={notif.show} severity={notif.severity} onClose={handleNotifClose}>
        {notif.message}
      </Notification>

      <Toolbar>
        <BootstrapTooltip title="Voltar" >
          <IconButton onClick={() => navigate(-1)}
            sx={{backgroundColor: 'black'}}>
            <ArrowBackIcon fontSize='medium' sx={{color: 'whitesmoke', fontWeight: 'bold'}}/>
          </IconButton>
        </BootstrapTooltip>
      </Toolbar>

      <Paper
        className="Perfil-container"
        sx={{
          width: '512px',
          background: 'whitesmoke',
          maxWidth: '90%',
          margin: '25px auto 0 auto',
          borderRadius: '5px',
          p: '5px 20px 5px 20px',
          boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.4)'
        }}
      >
        <FormTitle
          title="Editar Minha Conta"
        /> 
        <form>
          <TextField
            id="standard-basic"
            label="Nome"
            type="name"
            variant='filled'
            color='secondary'
            required
            fullWidth
            name="nome"
            value={myAccountDatas.nome}
            disabled
          />
          <TextField sx={{marginTop: '15px'}}
            id="standard-basic"
            label="Nome"
            type="name"
            variant='filled'
            color='secondary'
            required
            fullWidth
            name="sobrenome"
            value={myAccountDatas.sobrenome}
            disabled
          />
          <TextField sx={{marginTop: '15px'}}
            id="standard-basic"
            label="E-mail"
            type="email"
            variant='filled'
            color='secondary'
            required
            fullWidth
            name="email"
            value={myAccountDatas.email}
            disabled
          />
        </form>

        {
          !isAccountActive && 
          <Button sx={{mt: '20px', background: 'black', fontWeight: 'bold'}}
            color="error"
            variant='contained'
            fullWidth
            startIcon={<HowToRegIcon style={{fontWeight: 'bold'}}/>}
            onClick={() => setShowDialog(true)}
          >
            Ativar Conta
          </Button>  
        }

        {
          isAccountActive && 
          <Button sx={{mt: '20px', background: 'black', fontWeight: 'bold'}}
            color="error"
            variant='contained'
            fullWidth
            startIcon={<PersonOffIcon style={{fontWeight: 'bold'}}/>}
            onClick={() => setShowDialog(true)}
          >
            Inavatir Conta
          </Button> 
        }
      </Paper>
    </>
  )
}
