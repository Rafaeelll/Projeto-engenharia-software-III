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
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventIcon from '@mui/icons-material/Event';

function Row({ visualizacao, onDelete }) {
  const API_PATH_AG = '/agendas';
  const API_PATH_JG = '/jogos'

  const [open, setOpen] = React.useState(false);
  const [agendas, setAgendas] = React.useState([]);
  const [jogos, setJogos] = React.useState([]); // Estado para armazenar os dados dos jogos


  const handleDeleteClick = () => {
    onDelete(visualizacao.id);
  };

  const fetchAgenda = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_AG}`);

      // Filtrar apenas agendas relacionado a uma visualização específica
      const agendaRelacionada = result.find(item => item.id === visualizacao.agenda_id);

      if (agendaRelacionada) {
        // Adicionar o titulo da agenda diretamente ao objeto visualizacao
        visualizacao.agenda_title = agendaRelacionada.titulo_agenda;
        setAgendas([agendaRelacionada]);

         // Buscar o jogo correspondente ao ID da agenda
         const resultJogos = await myfetch.get(`${API_PATH_JG}`);
         const jogoRelacionado = resultJogos.find(jogo => jogo.id === agendaRelacionada.jogo_id);
         setJogos([jogoRelacionado]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchAgenda();
  }, []);

  const handleCollapseToggle = () => {
    setOpen(!open);
    if (!open) {
      fetchAgenda();
    }
  };

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
  function getStatusIcon(status){
    switch (status){
      case 'Agendado':
        return <EventIcon/>;
      case 'Finalizada':
        return <EventAvailableIcon/>;
      case 'Em andamento':
        return <PendingActionsIcon/>;
      default:
        return null;
    }
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
          {visualizacao.id}
        </TableCell>
        <TableCell size='small' align="center">{visualizacao.agenda_id}</TableCell>
        <TableCell size='small' align="center">{visualizacao.numero_visualizacao}</TableCell>
        <TableCell size='small' align="center">
          <Link to={'./' + visualizacao.id}>
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
              <u>Agendas</u> 
            </Typography>
              <Table size="small" aria-label="Agendas">
                <TableHead>
                  <TableRow>
                    <TableCell size='small' align="center">Agenda ID</TableCell>
                    <TableCell size='small' align="center">Título</TableCell>
                    <TableCell size='small' align="center">ID - Nome Do Jogo</TableCell>
                    <TableCell size='small' align="center">Início</TableCell>
                    <TableCell size='small' align="center">
                      Fim
                    </TableCell>
                    <TableCell size='small' align="center">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agendas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography style={{ color: 'GrayText' }}>Agenda vazia</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    agendas.map((agendaItem) => (
                    <TableRow key={agendaItem.id}>
                      <TableCell size='small' align="center">{agendaItem.id}</TableCell>
                      <TableCell size='small' align="center">{agendaItem.titulo_agenda}</TableCell>
                      <TableCell size='small' align="center">
                          {agendaItem.jogo_id} - {jogos[0]?.nome}
                        </TableCell>
                      <TableCell size='small' align="center">
                        {format(parseISO(agendaItem.data_horario_inicio), 'dd/MM/yyyy - HH:mm')}
                      </TableCell>
                      <TableCell size='small' align="center">
                        {format(parseISO(agendaItem.data_horario_fim), 'dd/MM/yyyy - HH:mm')}
                      </TableCell>
                      <TableCell size='small' align="center" style={{ color: getStatusColor(agendaItem.status)}}>
                        {getStatusIcon(agendaItem.status)} {agendaItem.status}
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

export default function CollapsibleTable() {
  const API_PATH_VS = '/visualizacoes';

  const [visualizacoes, setVisualizacoes] = React.useState([]);
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
      const result = await myfetch.get(API_PATH_VS);
      setVisualizacoes(result);
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
        await myfetch.delete(`${API_PATH_VS}/${deleteId}`);
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

      <TableContainer sx={{ width: '70%', margin: '0 auto', marginTop: '50px', 
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh'}} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Visualizações</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell size='small'>ID Visualização</TableCell>
              <TableCell size='small' align="center">ID Agenda</TableCell>
              <TableCell size='small' align="center">Qtde De Visualizações</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
              <TableCell size='small' align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visualizacoes.length === 0 ? ( // Verifica se não há jogos
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{color: 'GrayText'}}>Tabela vazia, crie uma nova visualização</Typography> 
                </TableCell>
              </TableRow>
            ) : (
              // Renderiza as linhas da tabela
              visualizacoes.map((visualizacao) => (
                <Row key={visualizacao.id} visualizacao={visualizacao} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
