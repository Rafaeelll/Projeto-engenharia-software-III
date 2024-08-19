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
import ConfirmImgDialog from './ConfirmImgDialog';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import myfetch from '../../utils/myfetch';
import Notification from './Notification';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import { FaTwitch } from "react-icons/fa";
import { RiKickFill } from "react-icons/ri";

export default function CollapsibleTableUsuario() {
  const API_PATH_US = '/usuarios';

  const [userPerfil, setUserPerfil] = React.useState([]);
  const [showWaiting, setShowWaiting] = React.useState(false);
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

  const handleNotifClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ ...notif, show: false });
  };

  function Row({ usuario }) {
    const [open, setOpen] = React.useState(false);
    const [userAcounts, setUserAcounts] = React.useState([]);
    const [showDialog, setShowDialog] = React.useState(false);
    const nav = useNavigate();

    const fetchUserAcount = async () => {
      try {
        const result = await myfetch.get(API_PATH_US);
        if (result) {
          const formattedUserAcount = result.map(user => ({
            id: user.id,
            email: user.email,
            senha_acesso: user.senha_acesso,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            status: user.status
          }));
          setUserAcounts(formattedUserAcount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    React.useEffect(() => {
      if (open) {
        fetchUserAcount();
      }
    }, [open]);

    const handleImageClick = () => {
      setShowDialog(true);
    };

    const handleCloseDialog = () => {
      setShowDialog(false);
    };

    const handleCollapseToggle = () => {
      setOpen(!open);
    };

    function getAccountStatus(status) {
      switch (status) {
        case false:
          return 'red';
        case true:
          return 'green';
        default:
          return 'black';
      }
    }

    function getPlatformIcon(plataforma_fav) {
      switch (plataforma_fav) {
        case 'Facebook':
          return <FacebookIcon color='primary' />;
        case 'Youtube':
          return <YouTubeIcon color='error' />;
        case 'Kick':
          return <RiKickFill color='green' size={18} />;
        case 'Twitch':
          return <FaTwitch color='purple' size={16} />;
        default:
          return null;
      }
    }

    function getPlataformColor(plataforma_fav) {
      switch (plataforma_fav) {
        case 'Facebook':
          return 'blue';
        case 'Youtube':
          return 'red';
        case 'Kick':
          return 'green';
        case 'Twitch':
          return 'purple';
        default:
          return 'black';
      }
    }

    return (
      <>
        <ConfirmImgDialog
          open={showDialog}
          onClose={handleCloseDialog}
          title="Imagem De Perfil"
          userName={<Typography> {usuario.nome + ' ' + usuario.sobrenome} </Typography>}
          profileImg={
            <Avatar
              src={import.meta.env.VITE_BACKEND_URI_FILES + usuario.image}
              alt="Foto de perfil"
              style={{ width: '200px', height: '200px', boxShadow: '0 5px 10px 0px rgba(0, 0, 0, 0.2)' }}
            />
          }
          onConfirm={() => {
            nav('./image/' + usuario.id);
          }}
        />

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
          <TableCell size='small' align="center">{usuario.telefone}</TableCell>
          <TableCell size='small' align="center">
            {usuario.data_nasc ? format(parseISO(usuario.data_nasc), 'dd/MM/yyyy') : 'Nulo'}
          </TableCell>
          <TableCell size='small' align="center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getPlatformIcon(usuario.plataforma_fav)}
              <Typography
                variant="body2"
                sx={{ ml: '4px', color: getPlataformColor(usuario.plataforma_fav), fontWeight: 'bold' }}
              >
                {usuario.plataforma_fav ? usuario.plataforma_fav : 'Nulo'}
              </Typography>
            </div>
          </TableCell>
          <TableCell size='small' align="center">
            {usuario.jogo_fav ? usuario.jogo_fav : 'Nulo'}
          </TableCell>
          <TableCell size='small' align="center">
            <IconButton onClick={handleImageClick}>
              <Avatar sx={{ width: '50px', height: '50px' }}
                alt='Foto De Perfil'
                src={import.meta.env.VITE_BACKEND_URI_FILES + usuario.image}
              />
            </IconButton>
          </TableCell>
          <TableCell size='small' align="center">
            <Link to={'./profile/' + usuario.id}>
              <IconButton aria-label="Editar">
                <EditIcon />
              </IconButton>
            </Link>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography sx={{ fontWeight: 'bolder' }} variant="h6" gutterBottom component="div" color='primary'>
                  <u>Minha Conta</u>
                </Typography>
                <Table size="small" aria-label="Visualizações">
                  <TableHead>
                    <TableRow>
                      <TableCell size='small' align="center">Data De Criação</TableCell>
                      <TableCell size='small' align="center">Última Atualização</TableCell>
                      <TableCell size='small' align="center">Email</TableCell>
                      <TableCell size='small' align="center">Senha</TableCell>
                      <TableCell size='small' align="center">Status</TableCell>
                      <TableCell size='small' align="center">Editar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userAcounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography style={{ color: 'GrayText' }}>Dados da conta não encontrados</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      userAcounts.map((userAcountItem) => (
                        <TableRow key={userAcountItem.id}>
                          <TableCell size='small' align="center">
                            {userAcountItem.createdAt ? format(parseISO(userAcountItem.createdAt), 'dd/MM/yyyy') : 'Nulo'}
                          </TableCell>
                          <TableCell size='small' align="center">
                            {userAcountItem.updatedAt ? format(parseISO(userAcountItem.updatedAt), 'dd/MM/yyyy') : 'Nulo'}
                          </TableCell>
                          <TableCell size='small' align="center">{userAcountItem.email}</TableCell>
                          <TableCell size='small' align="center">{userAcountItem.senha_acesso}</TableCell>
                          <TableCell size='small' align="center" sx={{ color: getAccountStatus(userAcountItem.status), fontWeight: 'bolder' }}>
                            <Link to={'./account_status/' + usuario.id}>
                              <IconButton size='small'>
                                <EditIcon sx={{ ml: '5px' }} />
                              </IconButton>
                            </Link>
                            {userAcountItem.status ? 'Ativo' : 'Inativo'}
                          </TableCell>
                          <TableCell size='small' align="center">
                            <Link to={'./minha_conta/' + usuario.id}>
                              <IconButton aria-label="Editar">
                                <EditIcon />
                              </IconButton>
                            </Link>
                          </TableCell>
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

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showWaiting}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <Notification
        show={notif.show}
        severity={notif.severity}
        onClose={handleNotifClose}
      >
        {notif.message}
      </Notification>

      <TableContainer sx={{ width: '75%', margin: '0 auto', marginTop: '50px',
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh' }} component={Paper}>
        <Typography sx={{ marginLeft: '20px', mt: '10px', fontWeight: 'bolder' }} variant="h6" color='secondary'>
          <u>Perfil</u>
        </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell size='small'>ID - Nome Do Usuário</TableCell>
              <TableCell size='small' align="center">Telefone</TableCell>
              <TableCell size='small' align="center">Data De Nascimento</TableCell>
              <TableCell size='small' align="center">Plataforma Favorita</TableCell>
              <TableCell size='small' align="center">Jogo Favorito</TableCell>
              <TableCell size='small' align="center">Imagem de Perfil</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPerfil.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{ color: 'GrayText' }}>Tabela vazia, crie um novo perfil</Typography>
                </TableCell>
              </TableRow>
            ) : (
              userPerfil.map((usuario) => (
                <Row key={usuario.id} usuario={usuario} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
