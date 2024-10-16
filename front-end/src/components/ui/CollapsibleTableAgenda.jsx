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
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import FilterListIcon from '@mui/icons-material/FilterList';
import ConfirmFilterDialog from '../ui/ConfirmFilterDialog';
import { MenuItem, Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import { FaTwitch } from "react-icons/fa";
import { RiKickFill } from "react-icons/ri";

export default function CollapsibleTable() {

  const { id, filterStatus: paramFilterStatus } = useParams();  // Obtenha o ID e filterStatus da URL
  const [filterStatus, setFilterStatus] = React.useState(paramFilterStatus || ''); // Inicialize o estado com filterStatus da URL
  const API_PATH_AG = '/agendas';
  const API_PATH_AG_FILTER = '/agendas/status'
  const API_PATH_VS = '/visualizacoes';
  const navigate = useNavigate()

  const [agendas, setAgendas] = React.useState([]);
  const [showWaiting, setShowWaiting] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [notif, setNotif] = React.useState({
    show: false,
    message: '',
    severity: 'success'
  });

  const handleFilterClick = () => {
    setOpenFilter(true);
  };

  const fetchData = async () => {
    setShowWaiting(true);
    try {
      // Adicionando o filtro no URL se estiver presente
      let apiUrl = API_PATH_AG;
      let apiUrlFilter = API_PATH_AG_FILTER
      let result;

      if (filterStatus) {
        result = await myfetch.get(`${apiUrlFilter}/${filterStatus}`)
        setAgendas(result);
      }
      
      if (id) {
        result = await myfetch.get(`${apiUrl}/${id}`);
        setAgendas([result]);

      } else {
        result = await myfetch.get(apiUrl);
        setAgendas(result)
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setShowWaiting(false);
    }
  };
  

  React.useEffect(() => {
    fetchData();
  }, [filterStatus]);

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
        await myfetch.delete(`${API_PATH_AG}/${deleteId}`);
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

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterDialogClose = async (answer) => {
    setOpenFilter(false);
    if (answer && filterStatus !== '') {
      try {
        await fetchData();  // Continue buscando os dados para atualizar a tabela
        navigate(`/agenda/${filterStatus}`);  // Navegue para a página de resultado filtrado
  
        // Exibe a notificação de sucesso
        setNotif({
          show: true,
          message: 'Filtragem realizada com sucesso',
          severity: 'success'
        });
      } catch (error) {
        // Exibe a notificação de erro em caso de falha
        setNotif({
          show: true,
          message: 'ERRO: ' + error.message,
          severity: 'error'
        });
      }
    } else {
      fetchData();  // Caso o filtro não seja aplicado, apenas recarregue os dados
    }
  };
  

  const handleNotifClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotif({ ...notif, show: false });
  };

  function Row({ agenda, onDelete }) {
    const [open, setOpen] = React.useState(false);
    const [visualizacoes, setVisualizacoes] = React.useState([]);

    const handleDeleteClick = () => {
      onDelete(agenda.id);
    };

    const fetchVisualizacao = async () => {
      try {
        const resultVisualizacoes = await myfetch.get(`${API_PATH_VS}`);
        const visualizacaoRelacionado = resultVisualizacoes.find(item => item.agenda_id === agenda.id);
        if (visualizacaoRelacionado) {
          setVisualizacoes([visualizacaoRelacionado])
        }
      } catch (error) {
        console.error(error);
      }
    };

    React.useEffect(() => {
      if (open) {
        fetchVisualizacao();
      }
    }, [open]);

    const handleCollapseToggle = () => {
      setOpen(!open);
      if (!open) {
        fetchVisualizacao();
      }
    };

    function getStatusColor(status){
      switch (status){
        case 'Agendado':
        case 'Inicialização Confirmada':
          return 'red';
        case 'Finalizada':
        case 'Finalização Confirmada':
          return 'green';
        case 'Em andamento':
          return 'lightblue';
        default:
          return null;
      }
    }

    function getStatusIcon(status){
      switch (status){
        case 'Agendado':
        case 'Inicialização Confirmada':
          return <EventIcon />;
        case 'Finalizada':
        case 'Finalização Confirmada':
          return <EventAvailableIcon />;
        case 'Em andamento':
          return <PendingActionsIcon />;
        default:
          return null;
      }
    }

    function getPlatformIcon(plt_transm){
      switch (plt_transm){
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

    function getPlataformColor(plt_transm){
      switch (plt_transm){
        case 'Facebook':
          return 'navy';
        case 'Youtube':
          return 'red';
        case 'Kick':
          return 'green';
        case 'Twitch':
          return 'purple';
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
            {agenda.titulo_agenda}
          </TableCell>
          <TableCell size='small' align="center">{agenda.id}</TableCell> 
          <TableCell size='small' align="center">{agenda.jogos_associados + ''}</TableCell>   
          <TableCell size='small' align="center">
            {format(parseISO(agenda.data_horario_inicio), 'dd/MM/yyyy - HH:mm')}
          </TableCell>
          <TableCell size='small' align="center">
            {format(parseISO(agenda.data_horario_fim), 'dd/MM/yyyy - HH:mm')}
          </TableCell>
          <TableCell size='small' align="center">
            {agenda.p_data_horario_inicio ? 
              format(parseISO(agenda.p_data_horario_inicio), 'dd/MM/yyyy - HH:mm') :
              'Nulo'
            }
          </TableCell>
          <TableCell size='small' align="center">
            {agenda.p_data_horario_fim ? 
              format(parseISO(agenda.p_data_horario_fim), 'dd/MM/yyyy - HH:mm') :
              'Nulo'
            }
          </TableCell>
          <TableCell size='small' align="center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getPlatformIcon(agenda.plt_transm)}
              <Typography variant="body1" sx={{ml: '4px', color: getPlataformColor(agenda.plt_transm), fontWeight: 'bold'}}>
                {agenda.plt_transm ? agenda.plt_transm : 'Nulo'}
              </Typography>
            </div>
          </TableCell>

          <TableCell size='small' align="center">
            {agenda.descricao ? agenda.descricao : 'Nulo'}
          </TableCell>      
          <TableCell size='small' align="center" style={{ color: getStatusColor(agenda.status)}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getStatusIcon(agenda.status)}
              <Typography variant="body2" sx={{ml:'2px', fontWeight: 'bold'}}>
                {agenda.status}
              </Typography>
            </div>
          </TableCell>
          <TableCell size='small' align="center">
            <Link to={`/agenda/editar/${agenda.id}`}>
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
                  <u>Visualizações</u> 
                </Typography>
                <Table size="small" aria-label="Visualizações">
                  <TableHead>
                    <TableRow>
                      <TableCell size='small' align="center">Visualização ID</TableCell>
                      <TableCell size='small' align="center">ID Agenda</TableCell>
                      <TableCell size='small' align="center">
                        Número de Visualizações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visualizacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography style={{ color: 'GrayText' }}>Visualização vazia</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      visualizacoes.map((visualizacaoItem) => (
                        <TableRow key={visualizacaoItem.id}>
                          <TableCell size='small' align="center">{visualizacaoItem.id}</TableCell>
                          <TableCell size='small' align="center">{visualizacaoItem.agenda_id}</TableCell>
                          <TableCell size='small' align="center"> 
                            {visualizacaoItem.numero_visualizacao}
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

      <ConfirmFilterDialog
        title="Preenche a filtragem"
        open={openFilter}
        onClose={handleFilterDialogClose}
      >
        <FormControl fullWidth sx={{mt: '10px'}}>
          <InputLabel id="demo-simple-select-label">Filtro de Status</InputLabel>
          <Select
            variant='outlined'
            label="Filtro de Status"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <MenuItem value="" disabled >
              Filtrar agendas por:
            </MenuItem>
            <MenuItem value="Agendado">Agendado</MenuItem>
            <MenuItem value="Inicialização Pendente">Inicialização Pendente</MenuItem>
            <MenuItem value="Inicialização Confirmada">Inicialização Confirmada</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Finalizada">Finalizada</MenuItem>
            <MenuItem value="Finalização Pendente">Finalização Pendente</MenuItem>
            <MenuItem value="Finalização Confirmada">Finalização Confirmada</MenuItem>
          </Select>
        </FormControl>
      </ConfirmFilterDialog>

      <Notification
        show={notif.show}
        severity={notif.severity}
        onClose={handleNotifClose}
      >
        {notif.message}
      </Notification>

      <TableContainer sx={{ width: '90%', margin: '0 auto', marginTop: '50px', 
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh'}} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Agendas</u> </Typography>

        <Tooltip title="Filtrar">
          {agendas.length === 0 ? null : (
            <IconButton size='small' sx={{ ml: '10px' }} onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
          )}
        </Tooltip>

        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell size='small'>Título da Agenda</TableCell>
              <TableCell size='small' align="center">Agenda ID</TableCell>
              <TableCell size='small' align="center">Jogos Associados</TableCell>
              <TableCell size='small' align="center">Início</TableCell>
              <TableCell size='small' align="center">Fim</TableCell>
              <TableCell size='small' align="center">Pausa Início</TableCell>
              <TableCell size='small' align="center">Fim Pausa</TableCell>
              <TableCell size='small' align="center">Plt Transmissão</TableCell>
              <TableCell size='small' align="center">Descrição</TableCell>
              <TableCell size='small' align="center">Status</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
              <TableCell size='small' align="center">Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  <Typography style={{color: 'GrayText'}}>Tabela vazia, crie uma nova agenda</Typography> 
                </TableCell>
              </TableRow>
            ) : (
              agendas.map((agenda) => (
                <Row key={agenda.id} agenda={agenda} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
