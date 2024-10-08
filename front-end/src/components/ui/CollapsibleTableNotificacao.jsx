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
import { Link, useParams } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import myfetch from '../../utils/myfetch';
import Notification from './Notification';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventIcon from '@mui/icons-material/Event';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import { FaTwitch } from 'react-icons/fa';
import { RiKickFill } from 'react-icons/ri';

export default function CollapsibleTableNotificacao() {
  const {id} = useParams()
  const API_PATH_NS = '/notificacoes';
  const API_PATH_AG = '/agendas';

  const [notificacoes, setNotificacoes] = React.useState([]);
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
      if (id) {
        const result = await myfetch.get(`${API_PATH_NS}/${id}`);
        setNotificacoes([result]);
      }
      else {
        const result = await myfetch.get(API_PATH_NS);
        setNotificacoes(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowWaiting(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    setShowDialog(true);
    setDeleteId(id);
  };

  const handleDialogClose = async (answer) => {
    setShowDialog(false);
    if (answer) {
      try {
        setShowWaiting(true);
        await myfetch.delete(`${API_PATH_NS}/${deleteId}`);
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

  function Row({ notificacao, onDelete }) {
    const [open, setOpen] = React.useState(false);
    const [agendas, setAgendas] = React.useState([]);

    const handleDeleteClick = () => {
      onDelete(notificacao.id);
    };

    const fetchAgenda = async () => {
      try {
        const result = await myfetch.get(`${API_PATH_AG}`);
        const agendaRelacionada = result.find(item => item.id === notificacao.agenda_id);

        if (agendaRelacionada) {
          notificacao.agenda_title = agendaRelacionada.titulo_agenda;
          setAgendas([agendaRelacionada]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    React.useEffect(() => {
      if (open) {
        fetchAgenda();
      }
    }, [open]);

    const handleCollapseToggle = () => {
      setOpen(!open);
      if (!open) {
        fetchAgenda();
      }
    };

    function getStatusColor(status) {
      switch (status) {
        case 'Agendado':
        case 'Inicialização Confirmada':
          return 'red';
        case 'Finalizada':
        case 'Finalização Confirmada':
          return 'green';
        case 'Em andamento':
          return 'lightblue';
        default:
          return 'black';
      }
    }

    function getStatusIcon(status) {
      switch (status) {
        case 'Agendado':
        case 'Inicialização Pendente':
        case 'Inicialização Confirmada':
          return <EventIcon />;
        case 'Finalizada':
        case 'Finalização Pendente':
        case 'Finalização Confirmada':
          return <EventAvailableIcon />;
        case 'Em andamento':
          return <PendingActionsIcon />;
        default:
          return null;
      }
    }

    function getPlatformIcon(plt_transm) {
      switch (plt_transm) {
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

    function getPlatformColor(plt_transm) {
      switch (plt_transm) {
        case 'Facebook':
          return 'navy';
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

    const notificationMessage = notificacao.mensagem;
    let redirectPath = '';
    if (notificationMessage.includes('prestes a começar') || notificationMessage.includes('já começou')) {
      redirectPath = `/agenda/confirmar-presenca/${notificacao.agenda_id}`;
    } else {
      redirectPath = `/agenda/confirmar-finalizacao/${notificacao.agenda_id}`;
    }

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
            {notificacao.id}
          </TableCell>
          <TableCell size='small' align="center">{notificacao.agenda_id}</TableCell>
          <TableCell size='small' align="center">
            {format(parseISO(notificacao.data_notificacao), 'dd/MM/yyyy - HH:mm')}
          </TableCell>
          <TableCell size='small' align="center">
            {notificacao.mensagem}
          </TableCell>
          <TableCell size='small' align="center">
            <Link to={redirectPath}>
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
                  sx={{ fontWeight: 'bolder' }} variant="h6" gutterBottom component="div" color='primary'>
                  <u>Agendas</u>
                </Typography>
                <Table size="small" aria-label="Agendas">
                  <TableHead>
                    <TableRow>
                      <TableCell size='small'>Título da Agenda</TableCell>
                      <TableCell size='small' align="center">Agenda ID</TableCell>
                      <TableCell size='small' align="center">Início</TableCell>
                      <TableCell size='small' align="center">Fim</TableCell>
                      <TableCell size='small' align="center">Pausa Início</TableCell>
                      <TableCell size='small' align="center">Fim Pausa</TableCell>
                      <TableCell size='small' align="center">Plt Transmissão</TableCell>
                      <TableCell size='small' align="center">Status</TableCell>
                      <TableCell size='small' align="center">Presença Confirmada?</TableCell>
                      <TableCell size='small' align="center">Finalização Confirmada?</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agendas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Typography style={{ color: 'GrayText' }}>Agenda vazia</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      agendas.map((agendaItem) => (
                        <TableRow key={agendaItem.id}>
                          <TableCell size='small' component="th" scope="row">
                            {agendaItem.titulo_agenda}
                          </TableCell>
                          <TableCell size='small' align="center">{agendaItem.id}</TableCell>
                          <TableCell size='small' align="center">
                            {format(parseISO(agendaItem.data_horario_inicio), 'dd/MM/yyyy - HH:mm')}
                          </TableCell>
                          <TableCell size='small' align="center">
                            {format(parseISO(agendaItem.data_horario_fim), 'dd/MM/yyyy - HH:mm')}
                          </TableCell>
                          <TableCell size='small' align="center">
                            {agendaItem.p_data_horario_inicio ?
                              format(parseISO(agendaItem.p_data_horario_inicio), 'dd/MM/yyyy - HH:mm') :
                              'Nulo'
                            }
                          </TableCell>
                          <TableCell size='small' align="center">
                            {agendaItem.p_data_horario_fim ?
                              format(parseISO(agendaItem.p_data_horario_fim), 'dd/MM/yyyy - HH:mm') :
                              'Nulo'
                            }
                          </TableCell>
                          <TableCell size='small' align="center">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {getPlatformIcon(agendaItem.plt_transm)}
                              <Typography variant="body1" sx={{ ml: '4px', color: getPlatformColor(agendaItem.plt_transm), fontWeight: 'bold' }}>
                                {agendaItem.plt_transm ? agendaItem.plt_transm : 'Nulo'}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell size='small' align="center" style={{ color: getStatusColor(agendaItem.status) }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {getStatusIcon(agendaItem.status)}
                              <Typography variant="body2" sx={{ ml: '2px', fontWeight: 'bold' }}>
                                {agendaItem.status}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell size='small' align="center">
                            <Typography variant="body1">
                              {agendaItem.confirmacao_presenca ? 'Sim' : 'Não'}
                            </Typography>
                          </TableCell>

                          <TableCell size='small' align="center">
                            {agendaItem.confirmacao_finalizacao ? 'Sim' : 'Não'}
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

      <TableContainer sx={{ width: '90%', margin: '0 auto', marginTop: '50px', background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh' }} component={Paper}>
        <Typography sx={{ marginLeft: '20px', mt: '10px', fontWeight: 'bolder' }} variant="h6" color='secondary'> <u>Notificações</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell size='small' align="center">Notificação ID</TableCell>
              <TableCell size='small' align="center">Agenda ID</TableCell>
              <TableCell size='small' align="center">Data Da Notificação</TableCell>
              <TableCell size='small' align="center">Mensagem</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
              <TableCell size='small' align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notificacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography style={{ color: 'GrayText' }}>Tabela vazia</Typography>
                </TableCell>
              </TableRow>
            ) : (
              notificacoes.map((notificacao) => (
                <Row key={notificacao.id} notificacao={notificacao} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
