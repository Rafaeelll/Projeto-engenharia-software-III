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
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import myfetch from '../../utils/myfetch';
import Notification from './Notification';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

export default function CollapsibleTableConfig() {
  const API_PATH_US = '/configuracoes';

  const [userConfigs, setUserConfigs] = React.useState([]);
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
      setUserConfigs(result);
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

  function Row({ configuracao }) {
    const [open, setOpen] = React.useState(false);
    const [userMoreConfigs, setUserMoreConfigs] = React.useState([]);

    const fetchUserConfigs = async () => {
      try {
        const result = await myfetch.get(`${API_PATH_US}`);
        if (result) {
          const formattedUserConfigs = result.map(config => ({
            id: config.id,
            createdAt: config.createdAt,
            updatedAt: config.updatedAt,
            horario_notif_inicio: config.horario_notif_inicio,
            horario_notif_fim: config.horario_notif_fim,
          }));
          setUserMoreConfigs(formattedUserConfigs);
        }
      } catch (error) {
        console.error(error);
      }
    };

    React.useEffect(() => {
      if (open) {
        fetchUserConfigs();
      }
    }, [open]);

    const handleCollapseToggle = () => {
      setOpen(!open);
      if (!open) {
        fetchUserConfigs();
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
            {configuracao.id}
          </TableCell>
          <TableCell size='small' align="center">
            {configuracao.confirmar_auto_ini ? 'Sim' : 'Não (Padrão)'}
          </TableCell>
          <TableCell size='small' align="center">
            {configuracao.confirmar_auto_fim ? 'Sim' : 'Não (Padrão)'}
          </TableCell>
          <TableCell size='small' align="center">
            {configuracao.horario_notif_inicio}
          </TableCell>
          <TableCell size='small' align="center">
            {configuracao.horario_notif_fim}
          </TableCell>
          <TableCell size='small' align="center">
            <Link to={'./' + configuracao.id}>
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
                <Typography 
                  sx={{ fontWeight: 'bolder' }} 
                  variant="h6" 
                  gutterBottom 
                  component="div" 
                  color='primary'
                >
                  <u>Mais informações</u>
                </Typography>
                <Table size="small" aria-label="Visualizações">
                  <TableHead>
                    <TableRow>
                      <TableCell size='small' align="center">Data de Criação</TableCell>
                      <TableCell size='small' align="center">Última Atualização</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userMoreConfigs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography style={{ color: 'GrayText' }}>Dados da conta não encontrados</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      userMoreConfigs.map((configItem) => (
                        <TableRow key={configItem.id}>
                          <TableCell size='small' align="center">
                            {configItem.createdAt ? format(parseISO(configItem.createdAt), 'dd/MM/yyyy') : 'Nulo'}
                          </TableCell>
                          <TableCell size='small' align="center">
                            {configItem.updatedAt ? format(parseISO(configItem.updatedAt), 'dd/MM/yyyy') : 'Nulo'}
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

      <TableContainer 
        sx={{ 
          width: '75%', 
          margin: '0 auto', 
          marginTop: '50px', 
          background: 'whitesmoke', 
          overflow: 'auto', 
          maxHeight: '70vh'
        }} 
        component={Paper}
      >
        <Typography 
          sx={{ 
            marginLeft: '20px', 
            mt: '10px', 
            fontWeight: 'bolder'
          }} 
          variant="h6" 
          color='secondary'
        >
          <u>Configurações</u>
        </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell size='small'>ID</TableCell>
              <TableCell size='small' align="center">Confirmar Início Da Agenda Automaticamente</TableCell>
              <TableCell size='small' align="center">Confirmar Fim Da Agenda Automaticamente</TableCell>
              <TableCell size='small' align="center">Notificações De Início (Agendas)</TableCell>
              <TableCell size='small' align="center">Notificações De Fim (Agendas)</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userConfigs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography style={{ color: 'GrayText' }}>Tabela vazia</Typography>
                </TableCell>
              </TableRow>
            ) : (
              userConfigs.map((configuracao) => (
                <Row key={configuracao.id} configuracao={configuracao} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
