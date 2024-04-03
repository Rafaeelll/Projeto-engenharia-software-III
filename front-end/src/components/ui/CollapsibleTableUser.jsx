import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from './ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import myfetch from '../../utils/myfetch';
import Notification from './Notification';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../../pages/main_pages/styles/main-pages-styles.css';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';


function Row({ usuario, onDelete }) {
  const API_PATH_US = '/usuarios';

  const [open, setOpen] = React.useState(false);
  const [userAcounts, setUserAcounts] = React.useState([]);

  const handleDeleteClick = () => {
    onDelete(usuario.id);
  };

  const fetchUserAcount = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_US}`);
      if(result){
        const formattedUserAcount = result.map(usuario =>({
          id: usuario.id,
          email: usuario.email,
          senha_acesso: usuario.senha_acesso
        }))
        setUserAcounts(formattedUserAcount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchUserAcount();
  }, []);

  const handleCollapseToggle = () => {
    setOpen(!open);
    if (!open) {
      fetchUserAcount();
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Tooltip title="Detalhes" arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleCollapseToggle}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell size='small' component="th" scope="row">
        {usuario.id} - {usuario.nome} {usuario.sobrenome}
        </TableCell>
        <TableCell size='small' align="center">{usuario.telefone} </TableCell>
        <TableCell size='small' align="center">
          {usuario.data_nasc ? 
            format(parseISO(usuario.data_nasc), 'dd/MM/yyyy') :
            'Nulo'
          }
        </TableCell>
        <TableCell size='small' align="center">
          {usuario.plataforma_fav ? usuario.plataforma_fav: 'Nulo'}
        </TableCell>
        <TableCell size='small' align="center">
          {usuario.jogo_fav ? usuario.jogo_fav: 'Nulo'}
        </TableCell>     
        <TableCell size='small' align="center">
          <Avatar sx={{width: '60px', height: '45px'}}
            alt='Foto De Perfil' 
            src={import.meta.env.VITE_BACKEND_URI_FILES + usuario.image}>
          </Avatar>
        </TableCell>        
        <TableCell size='small' align="center">
          <Link to={'./' + usuario.id}>
            <IconButton aria-label="Editar">
              <EditIcon />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="Excluir" onClick={handleDeleteClick}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>


      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
            <Typography 
              sx={{fontWeight: 'bolder'}} variant="h6" gutterBottom component="div" color='primary'> 
              <u>Minha Conta</u> 
            </Typography>
              <Table size="small" aria-label="Visualizações">
                <TableHead>
                  <TableRow>
                    <TableCell size='small' align="center">Email</TableCell>
                    <TableCell size='small' align="center">Senha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userAcounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography style={{ color: 'GrayText' }}>Dados da conta não encontrado</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userAcounts.map((userAcountItem) => (
                    <TableRow key={userAcountItem.id}>
                      <TableCell size='small' align="center">{userAcountItem.email}</TableCell>
                      <TableCell size='small' align="center">{userAcountItem.senha_acesso}</TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable() {
  const API_PATH_US = '/usuarios';

  const [userPerfil, setUserPerfil] = React.useState([]);
  const [showWaiting, setShowWaiting] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success'
  });

  const fetchData = async () => {
    setShowWaiting(true);
    try {
      const result = await myfetch.get(API_PATH_US);
      setUserPerfil(result);
    } catch (error) {
      console.error(error);
    } finally {
      setShowWaiting(false);
    }
  };
  
  
  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setShowDialog(true);
    setDeleteId(id);
  };

  const handleDialogClose = async (answer) => {
    setShowDialog(false);
    if (answer) {
      try {
        setShowWaiting(true);
        await myfetch.delete(`${API_PATH_US}/${deleteId}`);
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
        setShowWaiting(false);
      }
    }
  };

  const handleNotifClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ ...notif, show: false });
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

      <TableContainer sx={{ width: '75%', margin: '0 auto', marginTop: '50px', 
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh'}} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Perfil</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell size='small'>ID - Nome Do Usuário</TableCell>
              <TableCell size='small' align="center">Telefone</TableCell>
              <TableCell size='small' align="center">Data De Nascimento</TableCell>
              <TableCell size='small' align="center">Plataforma Favorita</TableCell>
              <TableCell size='small' align="center">Jogo Favorito</TableCell>
              <TableCell size='small' align="center">Imagem de Perfil</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
              <TableCell size='small' align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPerfil.length === 0 ? ( // Verifica se não há jogos
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{color: 'GrayText'}}>Tabela vazia, crie um novo perfil</Typography> 
                </TableCell>
              </TableRow>
            ) : (
              // Renderiza as linhas da tabela
              userPerfil.map((usuario) => (
                <Row key={usuario.id} usuario={usuario} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
