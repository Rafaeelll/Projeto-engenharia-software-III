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
import '../../pages/main_pages/styles/main-pages-styles.css';
import Tooltip from '@mui/material/Tooltip';


function Row({ configuracao}) {
  const API_PATH_US = '/configuracoes';

  const [open, setOpen] = React.useState(false);
  const [userMoreConfigs, setUserAcounts] = React.useState([]);

  const fetchUserConfigs = async () => {
    try {
      const result = await myfetch.get(`${API_PATH_US}`);
      if(result){
        const formattedUserConfigs = result.map(configuracao =>({
          id: configuracao.id,
          createdAt: configuracao.createdAt,
          updatedAt: configuracao.updatedAt,
          notif_no_inicio: configuracao.config.notif_no_inicio,
          notificar_no_fim: configuracao.config.notificar_no_fim,
          notificar_hora_antes_fim: configuracao.config.notificar_hora_antes_fim,
          notif_trinta_min_antes_fim: configuracao.config.notif_trinta_min_antes_fim
        }))
        setUserAcounts(formattedUserConfigs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchUserConfigs();
  }, []);

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
          <Tooltip title="Mais Configurações" arrow>
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
          {configuracao.config.confirmar_auto_ini ? 'Sim': 'Não (Padrão)'}
        </TableCell>
        <TableCell size='small' align="center">
          {configuracao.config.confirmar_auto_fim ? 'Sim': 'Não (Padrão)'}
        </TableCell>     
        <TableCell size='small' align="center">
          {configuracao.config.notificar_hora_antes_inicio ? 'Sim (Padrão)': 'Não'}
        </TableCell>
        <TableCell size='small' align="center">
          {configuracao.config.notif_trinta_min_antes_inicio ? 'Sim': 'Não'}
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
              sx={{fontWeight: 'bolder'}} variant="h6" gutterBottom component="div" color='primary'> 
              <u>Mais Configurações</u> 
            </Typography>
              <Table size="small" aria-label="Visualizações">
                <TableHead>
                  <TableRow>
                    <TableCell size='small' align="center">Data de Criação</TableCell>
                    <TableCell size='small' align="center">Ultima Atualização</TableCell>
                    <TableCell size='small' align="center">Notificar No Início Da Agenda</TableCell>
                    <TableCell size='small' align="center">Notificar No Fim Da Agenda</TableCell>
                    <TableCell size='small' align="center">Notificar 1h Antes Da Agenda Finalizar</TableCell>
                    <TableCell size='small' align="center">Notificar 30min Antes Da Agenda Finalizar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userMoreConfigs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography style={{ color: 'GrayText' }}>Dados da conta não encontrado</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userMoreConfigs.map((userConfigsItem) => (
                    <TableRow key={userConfigsItem.id}>
                      <TableCell size='small' align="center">
                        {userConfigsItem.createdAt ? 
                          format(parseISO(userConfigsItem.createdAt), 'dd/MM/yyyy') :
                          'Nulo'
                        }
                      </TableCell>
                      <TableCell size='small' align="center">
                        {userConfigsItem.updatedAt ? 
                          format(parseISO(userConfigsItem.updatedAt), 'dd/MM/yyyy') :
                          'Nulo'
                        }
                      </TableCell>                   
                      <TableCell size='small' align="center">{userConfigsItem.notif_no_inicio ? 'Sim': 'Não'}</TableCell>
                      <TableCell size='small' align="center">{userConfigsItem.notificar_no_fim ? 'Sim (Padrão)': 'Não'}</TableCell>
                      <TableCell size='small' align="center">{userConfigsItem.notificar_hora_antes_fim ? 'Sim': 'Não'}</TableCell>
                      <TableCell size='small' align="center">{userConfigsItem.notif_trinta_min_antes_fim ? 'Sim': 'Não'}</TableCell>
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
  const API_PATH_US = '/configuracoes';

  const [userConfigs, setUserPerfil] = React.useState([]);
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
        background: 'whitesmoke', overflow: 'auto', maxHeight: '70vh'}} component={Paper}> 
        <Typography sx={{marginLeft: '20px', mt:'10px', fontWeight: 'bolder'}} variant="h6" color='secondary'> <u>Configurações</u> </Typography>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell size='small'>ID</TableCell>
              <TableCell size='small' align="center">Confirmar Inicio Da Agenda Automaticamente</TableCell>
              <TableCell size='small' align="center">Confirmar Fim Da Agenda Automaticamente</TableCell>
              <TableCell size='small' align="center">Notificar 1h Antes Da Agenda Começar </TableCell>
              <TableCell size='small' align="center">Notificar 30min Antes Da Agenda Começar</TableCell>
              <TableCell size='small' align="center">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userConfigs.length === 0 ? ( // Verifica se não há jogos
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography style={{color: 'GrayText'}}>Tabela vazia</Typography> 
                </TableCell>
              </TableRow>
            ) : (
              // Renderiza as linhas da tabela
              userConfigs.map((configuracao) => (
                <Row key={configuracao.id} configuracao={configuracao}/> //onDelete={handleDelete}
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
